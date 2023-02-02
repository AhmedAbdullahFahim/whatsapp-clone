import { CircularProgress } from '@mui/material'

const Loading = () => {
  return (
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
        src='http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'
        height={200}
        alt=''
        style={{ marginBottom: 10 }}
      />
      <CircularProgress color='success' />
    </div>
  )
}

export default Loading
