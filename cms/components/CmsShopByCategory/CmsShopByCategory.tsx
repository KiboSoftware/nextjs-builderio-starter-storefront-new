import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Link,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material'
import { ShopByCategoryStyle } from './CmsShopByCategory.styles'
import { cmsShopByCategoryMock } from '__mocks__/stories'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const jsonData = cmsShopByCategoryMock

interface Item {
  link: string
  imageUrl: string
  imageAlt: string
  categoryName: string
}
interface ShopByCategoryProp {
  title: string
  categoryItems: Item[]
}

interface HomePageProps {
  shopByCategory: ShopByCategoryProp
}

const CmsHomePageCategory = (props: HomePageProps) => {
  const kiboTheme = useTheme()
  const [items, setItems] = useState(jsonData)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const isMobile = useMediaQuery(kiboTheme.breakpoints.down('md'))
  const isTablet = useMediaQuery(kiboTheme.breakpoints.up('sm'))
  const itemsPerPage = isMobile ? 1 : 8

  const handleItemClick = (item: Item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((selectedItem) => selectedItem !== item)
        : [...prevSelected, item]
    )
  }

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - itemsPerPage : prevIndex - itemsPerPage
    )
  }

  const handleNextClick = () => {
    setCurrentIndex((nextIndex) =>
      nextIndex + itemsPerPage >= items.length ? 0 : nextIndex + itemsPerPage
    )
  }

  useEffect(() => {
    setItems(jsonData)
  }, [])

  const isPrevDisabled = currentIndex === 0
  const isNextDisabled = currentIndex + itemsPerPage >= items.length

  return (
    <Container maxWidth={'xl'} sx={ShopByCategoryStyle.container}>
      <Box sx={ShopByCategoryStyle.navigationContainer}>
        <Typography variant="h1" gutterBottom sx={ShopByCategoryStyle.mainTitle}>
          {props?.shopByCategory?.title}
        </Typography>
        <Box sx={ShopByCategoryStyle.navigationIconConainer}>
          <IconButton
            onClick={handleNextClick}
            sx={
              isNextDisabled ? ShopByCategoryStyle.disabledButton : ShopByCategoryStyle.prevButton
            }
            disabled={isNextDisabled}
          >
            <NavigateNextIcon />
          </IconButton>
          <IconButton
            onClick={handlePrevClick}
            sx={
              isPrevDisabled ? ShopByCategoryStyle.disabledButton : ShopByCategoryStyle.nextButton
            }
            disabled={isPrevDisabled}
          >
            <NavigateBeforeIcon />
          </IconButton>
        </Box>
        <Box sx={ShopByCategoryStyle.viewAllText}>VIEW ALL</Box>
      </Box>
      <Grid container spacing={4} sx={ShopByCategoryStyle.gridContainer}>
        {items.slice(currentIndex, currentIndex + itemsPerPage).map((item: any) => (
          <Grid item md={3} sm={4} xs={12} onClick={() => handleItemClick(item)}>
            <Box sx={ShopByCategoryStyle.categoryItem}>
              <Link href={item.link} sx={ShopByCategoryStyle.categoryLink}>
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  sx={ShopByCategoryStyle.categoryImage}
                />
                <Box sx={ShopByCategoryStyle.categoryText}>{item.categoryName}</Box>
              </Link>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default CmsHomePageCategory
