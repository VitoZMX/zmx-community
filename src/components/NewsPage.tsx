import React, {useContext} from 'react'
import {Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import {Context} from '../index'
import {useAuthState} from 'react-firebase-hooks/auth'
import {CartNews} from './CartNews'
import {AddNewsForm} from './AddNewsForm'

export function NewsPage() {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)

    const arrNews = [
        {
            img: 'https://mobimg.b-cdn.net/v3/fetch/a2/a2b4c6bde2388a1cc8b872d683656080.jpeg',
            title: 'LizardLizardLizard Lizard Lizard Lizard Lizard Lizard Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'https://www.perunica.ru/uploads/posts/2018-11/1541255087_8140fotz.jpg',
            title: 'Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'https://funart.pro/uploads/posts/2021-12/1639603668_10-funart-pro-p-golubitsa-ptitsa-zhivotnie-krasivo-foto-10.jpg',
            title: 'Lizard Lizard Lizard Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'http://mobimg.b-cdn.net/v3/fetch/3e/3eacd5e350a0fe405d7bad3dfd500276.jpeg',
            title: 'Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'https://wp-s.ru/wallpapers/5/8/557867235029520/pevchie-pticy-na-zabore.jpg',
            title: 'Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'https://mobimg.b-cdn.net/v3/fetch/5a/5a05c4384e5a073883d72c1047e442df.jpeg',
            title: 'Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'https://www.tapeciarnia.pl/tapety/normalne/251545_trzy_male_kolorowe_ptaszki_galezie_drzewa.jpg',
            title: 'Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'https://i.pinimg.com/736x/42/a7/a5/42a7a5825f202ccc87521f6761a223ef.jpg',
            title: 'Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'https://pix-feed.com/wp-content/uploads/2018/07/ptica-kardinal-krasnyy.jpg',
            title: 'Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'https://funart.pro/uploads/posts/2022-05/1653385456_18-funart-pro-p-malenkaya-rozovaya-ptichka-krasivo-zhivotn-19.jpg',
            title: 'Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
        {
            img: 'https://funart.pro/uploads/posts/2022-06/1654797638_59-funart-pro-p-krasivie-malenkie-ptitsi-zhivotnie-krasivo-68.jpg',
            title: 'Lizard',
            text: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        },
    ]

    return (
        <Container style={{marginTop: '80px'}}>
            <AddNewsForm/>
            <Grid container spacing={1} sx={{direction: 'row', justifyContent: 'flex-start', alignItems: 'stretch'}}>
                {arrNews.map((e) => {
                    return <Grid item xs={12} sm={6} md={3}>

                        <CartNews img={e.img} title={e.title} text={e.text}/>
                    </Grid>
                })}
            </Grid>
        </Container>
    )
}