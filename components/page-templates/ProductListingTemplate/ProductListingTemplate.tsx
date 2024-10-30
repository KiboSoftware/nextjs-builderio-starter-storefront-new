import React, { useState, PropsWithChildren } from 'react'

import Add from '@mui/icons-material/Add'
import Apps from '@mui/icons-material/Apps'
import ReorderRounded from '@mui/icons-material/ReorderRounded'
import { Grid, MenuItem, Box, Button, Link, Typography, Breadcrumbs, Stack } from '@mui/material'
import getConfig from 'next/config'
import { useTranslation } from 'next-i18next'

import { PLPStyles } from './ProductListingTemplate.styles'
import { FilterTiles, FullWidthDivider, KiboPagination, KiboSelect } from '@/components/common'
import { KiboBreadcrumbs } from '@/components/core'
import { ProductCard } from '@/components/product'
import ProductCardListView, {
  ProductCardListViewProps,
} from '@/components/product/ProductCardListView/ProductCardListView'
import {
  CategoryFacet,
  CategoryFilterByMobile,
  FacetList,
  FacetSkeleton,
} from '@/components/product-listing'
import type { CategoryFacetData } from '@/components/product-listing/CategoryFacet/CategoryFacet'
import { useProductCardActions, useUpdateRoutes } from '@/hooks'
import { productGetters } from '@/lib/getters'
import { uiHelpers } from '@/lib/helpers'
import type {
  BreadCrumb as BreadCrumbType,
  CategorySearchParams,
  ProductCustom,
  ProductProperties,
} from '@/lib/types'

import type { Facet as FacetType, FacetValue, Product } from '@/lib/gql/types'

interface SortingValues {
  value: string
  id: string
  selected: boolean
}

export interface ProductListingTemplateProps extends PropsWithChildren<any> {
  breadCrumbsList: BreadCrumbType[]
  productListingHeader?: string
  facetList?: FacetType[]
  products?: Product[]
  sortingValues?: { options: SortingValues[]; selected: string }
  categoryFacet: CategoryFacetData
  totalResults: number
  isLoading?: boolean
  appliedFilters: FacetValue[]
  pageSize: number
  pageCount: number
  startIndex: number
  showQuickViewButton?: boolean
  isQuickViewModal?: boolean
  onSortItemSelection: (value: string) => void
  onPaginationChange?: (params?: CategorySearchParams) => void
  onInfiniteScroll?: () => void
}

// Component
const ProductListingTemplate = (props: ProductListingTemplateProps) => {
  const {
    breadCrumbsList,
    productListingHeader,
    facetList,
    products,
    sortingValues,
    categoryFacet,
    totalResults,
    isLoading,
    appliedFilters,
    pageSize,
    pageCount,
    startIndex,
    onSortItemSelection,
    onPaginationChange,
    onInfiniteScroll,
    showQuickViewButton = true,
  } = props
  // console.log('product:- ',products);
  const { publicRuntimeConfig } = getConfig()
  const productsPerPageArray = publicRuntimeConfig.productListing.pageSize
  const productPerPage = pageSize || productsPerPageArray[0]

  const handleProductPerPage = (size: number) =>
    onPaginationChange?.({
      pageSize: Number(size),
    })

  const { getProductLink } = uiHelpers()
  const { updateRoute } = useUpdateRoutes()
  // const { addToCart } = useAddCartItem()

  const {
    checkProductInWishlist,
    handleAddToCart,
    handleWishList,
    isATCLoading,
    openProductQuickViewModal,
  } = useProductCardActions()

  const [showFilterBy, setFilterBy] = useState<boolean>(false)
  const [isListView, setIsListView] = useState<boolean>(true)

  const { t } = useTranslation('common')
  // const { showModal } = useModalContext()

  const handleFilterBy = () => setFilterBy(!showFilterBy)

  const showCategoryFacet =
    categoryFacet.header ||
    (categoryFacet?.childrenCategories && categoryFacet?.childrenCategories?.length > 0)

  const handleClearAllFilters = () => {
    updateRoute('')
    window.scrollTo({
      top: 200,
      behavior: 'smooth',
    })
  }

  const handleSelectedTileRemoval = (selectedTile: string) => {
    updateRoute(selectedTile)
    window.scrollTo({
      top: 200,
      behavior: 'smooth',
    })
  }

  const productCardProps = (product: Product): ProductCardListViewProps => {
    const properties = productGetters.getProperties(product) as ProductProperties[]
    const productCode = productGetters.getProductId(product)
    const resourceTypeName = productGetters.getResourceTypeName(properties)
    const productType = product?.productType as string | undefined
    const variationProductCode = productGetters.getVariationProductCode(product)
    const categoryCode = product?.categories?.[0]?.categoryCode as string | undefined
    const seoFriendlyUrl = productGetters.getSeoFriendlyUrl(product)
    const listItemUrl =
      categoryCode !== undefined && seoFriendlyUrl
        ? `/products/${categoryCode}/${seoFriendlyUrl}/${productCode}`
        : `/product/${productCode}`
    return {
      productCode,
      properties,
      resourceTypeName,
      categoryCode,
      productType,
      variationProductCode,
      seoFriendlyUrl,
      productDescription: productGetters.getShortDescription(product),
      showQuickViewButton: showQuickViewButton,
      badge: productGetters.getBadgeAttribute(properties),
      imageUrl:
        productGetters.getCoverImage(product) &&
        productGetters.handleProtocolRelativeUrl(productGetters.getCoverImage(product)),
      link: listItemUrl as string,
      price: t<string>('currency', {
        val: productGetters.getPrice(product).regular,
      }),
      ...(productGetters.getPrice(product).special && {
        salePrice: t<string>('currency', {
          val: productGetters.getPrice(product).special,
        }),
      }),
      priceRange: productGetters.getPriceRange(product),
      title: productGetters.getName(product),
      brand: productGetters.getBrandName(properties),
      newProduct: productGetters.getNewProductAttrName(properties),
      variantProductName: productGetters.getVariantProductAttributeName(properties),
      rating: productGetters.getRating(product),
      isInWishlist: checkProductInWishlist({
        productCode,
        variationProductCode,
      }),
      isShowWishlistIcon: !productGetters.isVariationProduct(product),
      isLoading: isLoading,
      isATCLoading,
      fulfillmentTypesSupported: product?.fulfillmentTypesSupported as string[],
      onAddOrRemoveWishlistItem: () => handleWishList(product as ProductCustom),
      onClickQuickViewModal: () => openProductQuickViewModal({ product: product as ProductCustom }),
      onClickAddToCart: (payload: any) => handleAddToCart(payload),
    }
  }
  // Update breadcrumbs links
  const updatedBreadcrumbsList = breadCrumbsList.map((breadcrumb) => ({
    ...breadcrumb,
    link: breadcrumb.link ? breadcrumb.link.replace('/category/', '/products/') : breadcrumb.link,
  }))

  return (
    <>
      <Box sx={{ ...PLPStyles.breadcrumbsClass }}>
        <KiboBreadcrumbs breadcrumbs={updatedBreadcrumbsList} />
      </Box>

      {productListingHeader && !showFilterBy ? (
        <>
          <Typography variant="h1" sx={{ ...PLPStyles.categoryFacetHeader }}>
            {productListingHeader}
          </Typography>
          <FullWidthDivider />
        </>
      ) : null}
      {props.children}
      {!showFilterBy && (
        <Box>
          <Box sx={{ ...PLPStyles.mainSection }}>
            <Box sx={{ ...PLPStyles.sideBar }}>
              {showCategoryFacet && (
                <CategoryFacet categoryFacet={categoryFacet} breadcrumbs={breadCrumbsList} />
              )}
              {isLoading && (
                <Stack gap={0.5}>
                  {Array.from(Array(3)).map((_, index) => (
                    <FacetSkeleton key={index} />
                  ))}
                </Stack>
              )}
              {!isLoading && (
                <FacetList
                  facetList={facetList}
                  showSearchAndCount={false}
                  onFilterByClose={handleFilterBy}
                  appliedFilters={appliedFilters}
                  onSelectedTileRemoval={handleSelectedTileRemoval}
                />
              )}
              <Box pt={4} textAlign={'center'}>
                <Button variant="contained" color="primary" onClick={handleClearAllFilters}>
                  {t('clear-settings')}
                </Button>
              </Box>
            </Box>

            <Box sx={{ ...PLPStyles.plpGrid }}>
              <Box sx={{ ...PLPStyles.navBar }}>
                <Box sx={{ ...PLPStyles.navBarMain }}>
                  <Box sx={{ ...PLPStyles.navBarView }}>
                    <Box onClick={() => setIsListView(true)}>
                      <ReorderRounded fontSize="medium" {...(isListView && { color: 'primary' })} />
                    </Box>
                    <Box onClick={() => setIsListView(false)}>
                      <Apps fontSize="medium" {...(!isListView && { color: 'primary' })} />
                    </Box>
                    {!isLoading && onPaginationChange && (
                      <Box display="flex" pr={4} ml="auto">
                        <Typography
                          variant="body1"
                          color="text.primary"
                          sx={{ marginRight: '1rem' }}
                        >
                          {t('view')}
                        </Typography>
                        {productsPerPageArray.length > 1 && (
                          <Breadcrumbs separator={'|'}>
                            {productsPerPageArray?.map((item: number) => {
                              return (
                                <Typography
                                  key={item}
                                  variant="body2"
                                  color={item == productPerPage ? 'text.primary' : 'text.secondary'}
                                  fontWeight={item == productPerPage ? 'bold' : 'normal'}
                                  aria-label="breadcrumb-link"
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => handleProductPerPage(item)}
                                >
                                  {item}
                                </Typography>
                              )
                            })}
                          </Breadcrumbs>
                        )}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ ...PLPStyles.navBarSort }}>
                    <Box sx={{ ...PLPStyles.sorting }}>
                      <Typography
                        component="span"
                        variant="body2"
                        pt={0.4}
                        sx={{ ...PLPStyles.navBarLabel }}
                      >
                        {t('sort-by')}
                      </Typography>
                      <KiboSelect
                        name="sort-plp"
                        sx={{ typography: 'body2' }}
                        value={sortingValues?.selected}
                        onChange={(_name, value) => onSortItemSelection(value)}
                      >
                        {sortingValues?.options?.map((sortingVal) => (
                          <MenuItem
                            sx={{ typography: 'body2' }}
                            key={sortingVal?.id}
                            value={sortingVal?.id}
                          >
                            {sortingVal?.value}
                          </MenuItem>
                        ))}
                      </KiboSelect>
                    </Box>
                    <Box sx={{ ...PLPStyles.filterBy }}>
                      <Button
                        variant="outlined"
                        endIcon={<Add fontSize="small" />}
                        sx={{ ...PLPStyles.filterByButton }}
                        onClick={handleFilterBy}
                      >
                        {t('filter-by')}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {!isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', margin: '1rem 0 0 1rem' }}>
                    {appliedFilters?.length > 0 && (
                      <FilterTiles
                        appliedFilters={appliedFilters}
                        onSelectedTileRemoval={handleSelectedTileRemoval}
                      >
                        <Link sx={{ ...PLPStyles.clearAllButton }} onClick={handleClearAllFilters}>
                          {t('clear-settings')}
                        </Link>
                      </FilterTiles>
                    )}
                  </Box>
                  <Box sx={{ ...PLPStyles.totalResults }} pb={1}>
                    {t('results', { count: totalResults })}
                  </Box>
                </Box>
              )}

              <Grid container sx={{ flexWrap: 'wrap', rowGap: 2 }}>
                {isLoading &&
                  Array.from(Array(12)).map((_, ind) => {
                    return (
                      <Grid
                        key={ind}
                        display={'flex'}
                        justifyContent="center"
                        item
                        lg={4}
                        md={4}
                        sm={4}
                        xs={6}
                      >
                        <ProductCard isLoading={isLoading} link="#" />
                      </Grid>
                    )
                  })}
                {products?.map((product, index) => {
                  return (
                    <Grid
                      key={`${productGetters.getProductId(product)}-${index}`}
                      item
                      display={'flex'}
                      justifyContent={'center'}
                      lg={isListView ? 12 : 4}
                      md={isListView ? 12 : 4}
                      sm={isListView ? 12 : 4}
                      xs={isListView ? 12 : 6}
                    >
                      {isListView ? (
                        <ProductCardListView {...productCardProps(product)} />
                      ) : (
                        <ProductCard {...productCardProps(product)} />
                      )}
                    </Grid>
                  )
                })}
              </Grid>

              {!isLoading && (
                <Box>
                  <Box sx={{ ...PLPStyles.productResults, color: 'grey.600', typography: 'body2' }}>
                    {t('products-to-show', {
                      m: `${pageSize < totalResults ? pageSize : totalResults}`,
                      n: `${totalResults}`,
                    })}
                  </Box>
                  {pageSize < totalResults && onInfiniteScroll && (
                    <Box sx={{ ...PLPStyles.productResults }}>
                      <Button
                        id="show-more-button"
                        sx={{ ...PLPStyles.showMoreButton }}
                        variant="contained"
                        onClick={onInfiniteScroll}
                        color="inherit"
                      >
                        {t('show-more')}
                      </Button>
                    </Box>
                  )}

                  {!isLoading && onPaginationChange && (
                    <Box display={'flex'} justifyContent={'center'} width="100%" py={10}>
                      <KiboPagination
                        count={pageCount}
                        startIndex={startIndex}
                        pageSize={productPerPage}
                        onPaginationChange={onPaginationChange}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {showFilterBy && (
        <Box sx={{ ...PLPStyles.filterByMobile }}>
          <CategoryFilterByMobile
            facetList={facetList}
            header={productListingHeader}
            totalResults={totalResults}
            isLoading={isLoading}
            appliedFilters={appliedFilters}
            onClearAllFilters={handleClearAllFilters}
            onFilterByClose={handleFilterBy}
            breadCrumbsList={breadCrumbsList}
            onSelectedTileRemoval={handleSelectedTileRemoval}
          />
        </Box>
      )}
    </>
  )
}

export default ProductListingTemplate
