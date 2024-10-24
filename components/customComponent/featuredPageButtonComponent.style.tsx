export const buttonStyle = {
  featuredButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    position: 'relative',
    flexDirection: { md: 'row', sm: 'row', xs: 'column' },
    padding: '0 20px',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'end',
  },
  featuredButtonContent: {
    width: '100%',
    height: '374px',
    position: 'relative',
    top: '180px',
    zIndex: 1,
    backgroundColor: 'white',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-65%)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease',
    '&:hover': {
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
    },
  },

  /* Primary Style */
  primaryImageContainer: {
    width: '100%',
    height: '255px',
    borderRadius: '5px',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
    transition: 'box-shadow 0.3s ease',
    boxShadow: 'none',
  },
  primaryHeadingText: {
    width: '347px',
    height: 'auto',
    color: '#30299A',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '25px',
    fontFamily: 'Poppins',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '95px',
    paddingRight: '20px',
    paddingLeft: '20px',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#4C47C4',
    },
  },
  primaryParagraphText: {
    width: '347px',
    height: 'auto',
    color: '#30299A',
    fontSize: '16px',
    fontWeight: '300',
    lineHeight: '25px',
    fontFamily: 'Poppins',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '24px',
    paddingRight: '20px',
    paddingLeft: '20px',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#4C47C4',
    },
  },
  arrowPrimaryButton: {
    width: '61px',
    height: '74px',
    color: '#30299A',
    borderRadius: '26px 0px',
    border: '1px solid #30299A',
    backgroundColor: '#30299A',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#4C47C4',
    },
  },
  primaryArrowIcon: {
    color: '#fff',
  },

  /* Secondary Style */
  secondaryImageContainer: {
    width: '100%',
    height: '255px',
    borderRadius: '5px',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
    transition: 'box-shadow 0.3s ease',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
    },
  },
  secondaryHeadingText: {
    width: '347px',
    height: 'auto',
    color: '#30299A',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '25px',
    fontFamily: 'Poppins',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '95px',
    paddingRight: '20px',
    paddingLeft: '20px',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#4C47C4',
    },
  },
  secondaryParagraphText: {
    width: '347px',
    height: 'auto',
    color: '#30299A',
    fontSize: '16px',
    fontWeight: '300',
    lineHeight: '25px',
    fontFamily: 'Poppins',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '24px',
    paddingRight: '20px',
    paddingLeft: '20px',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#4C47C4',
    },
  },
  arrowSecondaryButton: {
    width: '61px',
    height: '74px',
    color: '#E3E2FF',
    borderRadius: '26px 0px',
    backgroundColor: '#E3E2FF',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#4C47C4',
    },
  },
  secondaryArrowIcon: {
    color: '#30299A',
  },

  /* Primary-specific hover with upward movement */
  primaryHoverEffect: {
    '&:hover': {
      transform: 'translateY(-75%)',
    },
  },
}
