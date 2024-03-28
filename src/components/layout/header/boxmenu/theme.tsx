import { extendTheme } from '@chakra-ui/react'
import { menuTheme } from './components/Menu'

const theme = extendTheme({
  components: {
    Menu: menuTheme,
  },
})

export default theme