import { CircularProgress, createTheme, ThemeProvider } from '@mui/material'

const Loading = () => {
  const theme = createTheme({
    palette: {
      icon: {
        main: '#aebac1',
      },
    },
  })
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <img
          src='/logo.webp'
          height={200}
          alt=''
          style={{ marginBottom: 10 }}
        />
        <CircularProgress color='icon' />
      </div>
    </ThemeProvider>
  )
}

export default Loading
