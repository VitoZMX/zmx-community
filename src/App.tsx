import React from 'react'
import './App.css'
import {Navbar} from './components/Navbar'
import {HashRouter} from 'react-router-dom'
import {AppRouter} from './components/AppRouter'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

function App() {

    const theme = createTheme({
        palette: {
            background: {
                default: '#e0e5ea'
            },
        },
    })

    return (
        <HashRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div>
                    <Navbar/>
                    <AppRouter/>
                </div>
            </ThemeProvider>
        </HashRouter>
    )
}

export default App