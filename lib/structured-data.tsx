/**
 * Shared utilities for generating structured data across the application
 * Eliminates duplication of schema.org patterns
 */

import React from 'react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface StructuredDataBase {
  "@context": string;
  "@type": string;
}

/**
 * Creates a BreadcrumbList structured data object
 * @param breadcrumbs Array of breadcrumb items
 * @returns Structured data object for BreadcrumbList
 */
export function createBreadcrumbStructuredData(breadcrumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Creates a base structured data object with common schema.org context
 * @param type The schema.org type
 * @param data Additional data to merge
 * @returns Base structured data object
 */
export function createStructuredData<T extends Record<string, any>>(
  type: string,
  data: T
): StructuredDataBase & T {
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };
}

/**
 * Creates a WebPage structured data object
 * @param name Page name
 * @param description Page description
 * @param url Page URL
 * @returns WebPage structured data
 */
export function createWebPageStructuredData(name: string, description: string, url: string) {
  return createStructuredData("WebPage", {
    name,
    description,
    url
  });
}

/**
 * Creates a CollectionPage structured data object
 * @param name Collection name
 * @param description Collection description
 * @param url Collection URL
 * @returns CollectionPage structured data
 */
export function createCollectionPageStructuredData(name: string, description: string, url: string) {
  return createStructuredData("CollectionPage", {
    name,
    description,
    url
  });
}

/**
 * Creates an Article structured data object
 * @param headline Article headline
 * @param description Article description
 * @param url Article URL
 * @param datePublished Publication date
 * @param dateModified Modification date
 * @param author Author information
 * @returns Article structured data
 */
export function createArticleStructuredData(
  headline: string,
  description: string,
  url: string,
  datePublished: string,
  dateModified: string,
  author: { name: string; url?: string }
) {
  return createStructuredData("Article", {
    headline,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: author.name,
      ...(author.url && { url: author.url })
    }
  });
}

/**
 * Creates a LocalBusiness structured data object
 * @param name Business name
 * @param description Business description
 * @param address Business address
 * @param telephone Business phone
 * @param url Business website
 * @returns LocalBusiness structured data
 */
export function createLocalBusinessStructuredData(
  name: string,
  description: string,
  address: string,
  telephone?: string,
  url?: string
) {
  return createStructuredData("LocalBusiness", {
    name,
    description,
    address,
    ...(telephone && { telephone }),
    ...(url && { url })
  });
}

/**
 * Renders structured data as a script tag
 * @param structuredData The structured data object
 * @returns JSX script element
 */
export function renderStructuredData(structuredData: any) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Creates multiple structured data objects and renders them
 * @param structuredDataArray Array of structured data objects
 * @returns Array of JSX script elements
 */
export function renderMultipleStructuredData(structuredDataArray: any[]) {
  return structuredDataArray.map((data, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  ));
}