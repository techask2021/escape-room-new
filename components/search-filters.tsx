"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, X, Search, MapPin, Tag } from "lucide-react"
import { getAllStatesFromDatabase, getCitiesWithCounts, getThemesWithCounts, getAllCountriesFromDatabase, getStatesWithRoomCounts } from "@/lib/data-source"

interface SearchFiltersProps {
  currentFilters?: {
    name?: string
    city?: string
    state?: string
    country?: string
    category?: string
  }
  onFiltersChange?: (filters: {
    name: string
    city: string
    state: string
    country: string
    category: string
  }) => void
}

export default function SearchFilters({ currentFilters, onFiltersChange }: SearchFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [filters, setFilters] = useState({
    name: currentFilters?.name || '',
    city: currentFilters?.city || '',
    state: currentFilters?.state || '',
    country: currentFilters?.country || '',
    category: currentFilters?.category || ''
  })
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<{ abbreviation: string, fullName: string }[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [themes, setThemes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingStates, setIsLoadingStates] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  useEffect(() => {
    loadFilterData()
  }, [])

  // Sync local state with currentFilters prop when it changes (e.g. URL update or Reset)
  useEffect(() => {
    if (currentFilters) {
      setFilters({
        name: currentFilters.name || '',
        city: currentFilters.city || '',
        state: currentFilters.state || '',
        country: currentFilters.country || '',
        category: currentFilters.category || ''
      })

      const activeFilters: string[] = []
      if (currentFilters.name) activeFilters.push(`Name: ${currentFilters.name}`)
      if (currentFilters.city) activeFilters.push(`City: ${currentFilters.city}`)
      if (currentFilters.state) activeFilters.push(`State: ${currentFilters.state}`)
      if (currentFilters.country) activeFilters.push(`Country: ${currentFilters.country}`)
      if (currentFilters.category) activeFilters.push(`Theme: ${currentFilters.category}`)
      setSelectedFilters(activeFilters)
    }
  }, [currentFilters])

  // Load states when country changes
  useEffect(() => {
    if (filters.country) {
      loadStatesForCountry(filters.country)
    } else {
      setStates([])
      setCities([])
    }
  }, [filters.country])

  // Load cities when state changes AND states are loaded
  useEffect(() => {
    if (filters.state && states.length > 0) {
      loadCitiesForState(filters.state)
    } else if (!filters.state) {
      setCities([])
    }
    // Note: We intentionally don't load cities if state is set but states array is empty
    // because we need the state abbreviation which comes from the states array
  }, [filters.state, states])

  const loadFilterData = async () => {
    try {
      const [countriesData, themesData] = await Promise.all([
        getAllCountriesFromDatabase(),
        getThemesWithCounts()
      ])

      setCountries(countriesData.data || [])
      setThemes(themesData.data?.map(t => t.theme).filter(Boolean) || [])
    } catch (error) {
      console.error('Error loading filter data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStatesForCountry = async (country: string) => {
    setIsLoadingStates(true)
    try {
      const statesData = await getStatesWithRoomCounts(country)
      const statesWithNames = statesData.data?.map(s => ({
        abbreviation: s.state,
        fullName: s.fullName
      })).filter(s => s.abbreviation && s.fullName) || []
      setStates(statesWithNames)
    } catch (error) {
      console.error('Error loading states:', error)
      setStates([])
    } finally {
      setIsLoadingStates(false)
    }
  }

  const loadCitiesForState = async (state: string) => {
    setIsLoadingCities(true)
    try {
      // Convert full state name to abbreviation for the API call
      const stateAbbr = states.find(s => s.fullName === state)?.abbreviation || state
      const citiesData = await getCitiesWithCounts(stateAbbr)
      const cityList = citiesData.data?.map(c => c.city).filter(Boolean) || []
      setCities(cityList)
    } catch (error) {
      console.error('Error loading cities:', error)
      setCities([])
    } finally {
      setIsLoadingCities(false)
    }
  }

  const removeFilter = (filter: string) => {
    if (filter.includes('Name:')) {
      handleFilterChange('name', '')
    } else if (filter.includes('City:')) {
      handleFilterChange('city', '')
    } else if (filter.includes('State:')) {
      handleFilterChange('state', '')
    } else if (filter.includes('Country:')) {
      handleFilterChange('country', '')
    } else if (filter.includes('Theme:')) {
      handleFilterChange('category', '')
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    let newFilters = { ...filters, [key]: value }
    let filtersForBackend = { ...newFilters }

    // If country changes, clear state and city
    if (key === 'country') {
      newFilters = { ...newFilters, state: '', city: '' }
      filtersForBackend = { ...filtersForBackend, state: '', city: '' }
    }
    // If state changes, clear the city
    else if (key === 'state') {
      newFilters = { ...newFilters, city: '' }
      filtersForBackend = { ...filtersForBackend, city: '' }
      // Convert full state name to abbreviation for backend
      if (value) {
        const stateAbbr = states.find(s => s.fullName === value)?.abbreviation || value
        filtersForBackend = { ...filtersForBackend, state: stateAbbr }
      }
    }

    // Optimistically update local state (this will trigger useEffect to load states/cities)
    setFilters(newFilters)

    // Notify parent
    onFiltersChange?.(filtersForBackend)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      name: '',
      city: '',
      state: '',
      country: '',
      category: ''
    }
    setFilters(clearedFilters)
    setSelectedFilters([])
    setCities([])
    setStates([])
    onFiltersChange?.(clearedFilters)
  }

  return (
    <Card className="mb-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 shadow-md hover:border-escape-red/30 transition-all overflow-hidden">
      <CardHeader className="pb-5 pt-6 px-6 border-b border-slate-200 bg-gradient-to-r from-escape-red/5 to-transparent">
        <CardTitle className="flex items-center gap-3 text-slate-900 text-xl font-semibold">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-escape-red/10 border-2 border-escape-red/20 shadow-sm">
            <Filter className="h-5 w-5 text-escape-red" />
          </div>
          <span>Search & Filter Escape Rooms</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 px-6 pb-8">
        {/* Room Name Search */}
        <div className="mb-8 p-5 bg-gradient-to-br from-escape-red/5 via-white to-escape-red/5 rounded-xl border-2 border-escape-red/20">
          <label className="text-sm font-semibold mb-3 block text-slate-800 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-escape-red/10 border border-escape-red/20">
              <Search className="h-4 w-4 text-escape-red" />
            </div>
            Search by Room Name
          </label>
          <div className="relative search-input-wrapper">
            <Input
              type="text"
              placeholder="Enter escape room name..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              onFocus={(e) => e.target.select()}
              className="w-full h-14 pl-12 text-base border-2 border-escape-red/30 bg-white focus:border-escape-red focus:ring-2 focus:ring-escape-red/30 transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-escape-red pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 border-2 border-blue-200/30">
            <label className="text-xs font-semibold mb-3 block text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 border border-blue-500/20">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
              </div>
              Country
            </label>
            <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
              <SelectTrigger className="h-14 border-2 border-blue-300/50 focus:border-blue-600 bg-white hover:bg-blue-50/50 text-base shadow-sm transition-all">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200 shadow-lg">
                {loading ? (
                  <SelectItem value="loading" disabled>Loading countries...</SelectItem>
                ) : (
                  countries.map((country, index) => (
                    <SelectItem key={`country-${index}-${country}`} value={country} className="hover:bg-blue-50 text-base py-3">
                      {country}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30 border-2 border-purple-200/30">
            <label className="text-xs font-semibold mb-3 block text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 border border-purple-500/20">
                <MapPin className="h-3.5 w-3.5 text-purple-600" />
              </div>
              State
            </label>
            <Select value={filters.state} onValueChange={(value) => handleFilterChange('state', value)} disabled={!filters.country}>
              <SelectTrigger className="h-14 border-2 border-purple-300/50 focus:border-purple-600 bg-purple-50/30 hover:bg-purple-50/50 disabled:opacity-60 disabled:cursor-not-allowed text-base shadow-sm transition-all">
                <SelectValue placeholder={filters.country ? "Select state" : "Select country first"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-purple-200 shadow-lg">
                {isLoadingStates ? (
                  <SelectItem value="loading" disabled>Loading states...</SelectItem>
                ) : states.length === 0 ? (
                  <SelectItem value="no-states" disabled>No states found</SelectItem>
                ) : (
                  states.map((state, index) => (
                    <SelectItem key={`state-${index}-${state.fullName}`} value={state.fullName} className="hover:bg-purple-50 text-base py-3">
                      {state.fullName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-green-50/50 via-white to-green-50/30 border-2 border-green-200/30">
            <label className="text-xs font-semibold mb-3 block text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500/10 border border-green-500/20">
                <MapPin className="h-3.5 w-3.5 text-green-600" />
              </div>
              City
            </label>
            <Select
              value={filters.city}
              onValueChange={(value) => handleFilterChange('city', value)}
              disabled={!filters.state}
            >
              <SelectTrigger className="h-14 border-2 border-green-300/50 focus:border-green-600 bg-green-50/30 hover:bg-green-50/50 disabled:opacity-60 disabled:cursor-not-allowed text-base shadow-sm transition-all">
                <SelectValue placeholder={filters.state ? "Select city" : "Select state first"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-green-200 shadow-lg">
                {isLoadingCities ? (
                  <SelectItem value="loading" disabled>Loading cities...</SelectItem>
                ) : cities.length === 0 ? (
                  <SelectItem value="no-cities" disabled>No cities found</SelectItem>
                ) : (
                  cities.map((city, index) => (
                    <SelectItem key={`city-${index}-${city}`} value={city} className="hover:bg-green-50 text-base py-3">
                      {city}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-escape-red/10 via-white to-escape-red/5 border-2 border-escape-red/30">
            <label className="text-xs font-semibold mb-3 block text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-escape-red/10 border border-escape-red/20">
                <Tag className="h-3.5 w-3.5 text-escape-red" />
              </div>
              Theme
            </label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="h-14 border-2 border-escape-red/30 focus:border-escape-red bg-escape-red/5 hover:bg-escape-red/10 text-base shadow-sm transition-all">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-escape-red/20 shadow-lg">
                {loading ? (
                  <SelectItem value="loading" disabled>Loading themes...</SelectItem>
                ) : (
                  themes.map((theme, index) => (
                    <SelectItem key={`theme-${index}-${theme}`} value={theme} className="hover:bg-escape-red/10 text-base py-3">
                      {theme}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedFilters.length > 0 && (
          <div className="mb-8 p-4 bg-slate-100/50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-escape-red" />
              <span className="text-sm font-semibold text-slate-800">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter, index) => {
                const [type, ...valueParts] = filter.split(': ')
                const value = valueParts.join(': ')
                return (
                  <Badge
                    key={`filter-${index}-${filter}`}
                    className="flex items-center gap-2 bg-escape-red text-white hover:bg-escape-red/90 transition-all shadow-sm hover:shadow-md cursor-pointer text-xs px-3 py-1.5"
                    onClick={() => removeFilter(filter)}
                  >
                    <span className="font-medium">{type}</span>
                    <span>{value}</span>
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-slate-200">
          <Button
            onClick={clearAllFilters}
            variant="outline"
            className="h-12 px-10 border-2 border-slate-300 text-slate-700 hover:bg-escape-red hover:border-escape-red hover:text-white transition-all flex items-center gap-2 font-semibold"
          >
            <X className="h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
