/**
 * Shared breadcrumb component with built-in structured data
 * Eliminates duplication of breadcrumb and structured data patterns
 */

'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { createBreadcrumbStructuredData, renderStructuredData, BreadcrumbItem as BreadcrumbDataItem } from "@/lib/structured-data";
import { Fragment } from "react";

export interface SharedBreadcrumbItem {
  name: string;
  href?: string; // If no href, it's the current page
}

export interface SharedBreadcrumbProps {
  items: SharedBreadcrumbItem[];
  className?: string;
}

/**
 * Shared breadcrumb component that automatically generates structured data
 * @param items Array of breadcrumb items
 * @param className Optional CSS class
 */
export function SharedBreadcrumb({ items, className }: SharedBreadcrumbProps) {
  // Convert items to structured data format
  const structuredDataItems: BreadcrumbDataItem[] = items.map(item => ({
    name: item.name,
    url: item.href || ''
  }));

  const structuredData = createBreadcrumbStructuredData(structuredDataItems);

  return (
    <>
      {/* Structured Data */}
      {renderStructuredData(structuredData)}
      
      {/* Visual Breadcrumb */}
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {items.map((item, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>
                    {item.name}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}

/**
 * Helper function to create breadcrumb items for location pages
 * @param country Country name
 * @param state State name (optional)
 * @param city City name (optional)
 * @param venue Venue name (optional)
 */
export function createLocationBreadcrumbs(
  country?: string,
  state?: string,
  city?: string,
  venue?: string
): SharedBreadcrumbItem[] {
  const items: SharedBreadcrumbItem[] = [
    { name: "Home", href: "https://escaperoomsfinder.com/" }
  ];

  if (country) {
    items.push({
      name: country,
      href: state || city || venue ? `https://escaperoomsfinder.com/locations/${country.toLowerCase()}` : undefined
    });
  }

  if (state) {
    items.push({
      name: state,
      href: city || venue ? `https://escaperoomsfinder.com/locations/${country?.toLowerCase()}/${state.toLowerCase().replace(/\s+/g, '-')}` : undefined
    });
  }

  if (city) {
    items.push({
      name: city,
      href: venue ? `https://escaperoomsfinder.com/locations/${country?.toLowerCase()}/${state?.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}` : undefined
    });
  }

  if (venue) {
    items.push({
      name: venue
    });
  }

  return items;
}

/**
 * Helper function to create breadcrumb items for theme pages
 * @param theme Theme name (optional)
 */
export function createThemeBreadcrumbs(theme?: string): SharedBreadcrumbItem[] {
  const items: SharedBreadcrumbItem[] = [
    { name: "Home", href: "https://escaperoomsfinder.com/" },
    { name: "Themes", href: theme ? "https://escaperoomsfinder.com/themes" : undefined }
  ];

  if (theme) {
    items.push({
      name: theme
    });
  }

  return items;
}

/**
 * Helper function to create breadcrumb items for blog pages
 * @param postTitle Post title (optional)
 */
export function createBlogBreadcrumbs(postTitle?: string): SharedBreadcrumbItem[] {
  const items: SharedBreadcrumbItem[] = [
    { name: "Home", href: "https://escaperoomsfinder.com/" },
    { name: "Blog", href: postTitle ? "https://escaperoomsfinder.com/blog" : undefined }
  ];

  if (postTitle) {
    items.push({
      name: postTitle
    });
  }

  return items;
}

/**
 * Helper function to create breadcrumb items for browse pages
 */
export function createBrowseBreadcrumbs(): SharedBreadcrumbItem[] {
  return [
    { name: "Home", href: "https://escaperoomsfinder.com/" },
    { name: "Browse Escape Rooms" }
  ];
}

/**
 * Helper function to create breadcrumb items for help pages
 */
export function createHelpBreadcrumbs(): SharedBreadcrumbItem[] {
  return [
    { name: "Home", href: "https://escaperoomsfinder.com/" },
    { name: "Help & FAQ" }
  ];
}