import {Button, Container, Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import {getDownloadURL, getStorage, listAll, ref} from 'firebase/storage'
import {useEffect, useState} from 'react'
import Box from '@mui/material/Box'

type ImageData = {
    img: string;
    rows: number;
    cols: number;
}

const useStyles = makeStyles((theme) => ({
    discordWidget: {
        border: 'none',
        width: '100%',
        height: '500px',
        marginBottom: theme.spacing(2),
    },
    socialButton: {
        margin: theme.spacing(1),
    },
    galleryImage: {
        width: '100%',
        height: 'auto',
        marginBottom: theme.spacing(2),
    },
}))

function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${
            size * rows
        }&fit=crop&auto=format&dpr=2 2x`,
    }
}

export function HomePage() {
    const classes = useStyles()
    const [imageUrls, setImageUrls] = useState<ImageData[]>([])

    const fetchImageUrls = async () => {
        const storage = getStorage()
        const storageRef = ref(storage, 'homePageImg/')
        const allFiles = await listAll(storageRef)
        const urls = await Promise.all(
            Array.from({length: 9}).map(async () => {
                const randomIndex = Math.floor(Math.random() * allFiles.items.length)
                const randomFile = allFiles.items[randomIndex]
                const url = await getDownloadURL(randomFile)
                return {img: url, rows: 1, cols: 1}
            })
        )
        setImageUrls(urls)
    }

    useEffect(() => {
        fetchImageUrls()
    }, [])

    return (
        <Container style={{marginTop: '80px'}}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h3" style={{textIndent: '20px'}} gutterBottom>
                        Добро пожаловать в сообщество ZMX!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Если вы любите игры, то вы попали в нужное место! У нас встречаются игроки, играющие в самые
                        разнообразные жанры - от многопользовательских онлайн-игр до казуальных и шутеров. Мы понимаем,
                        что все игроки имеют свои собственные интересы и предпочтения, поэтому мы стараемся предоставить
                        нашим пользователям широкий выбор игр, чтобы каждый мог найти то, что ему подходит лучше всего.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Наша миссия - поддерживать и развивать сообщество игроков всех возрастных категорий, увлеченных
                        игрыми как хобби, профессиональное направление или как способ расслабиться и отвлечься от
                        реальности. Мы поощряем открытое общение, обмен знаниями и опытом, и наша цель - создать уютную
                        и дружественную атмосферу, где люди могут наслаждаться играми, общаться и развиваться вместе.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        В нашем сообществе вы найдете множество интересных событий, турниров, квестов, конкурсов и
                        других
                        активностей, которые помогут вам насладиться игровым процессом и взаимодействовать с другими
                        участниками. Мы также предоставляем обширную базу знаний и превосходную техническую поддержку
                        для
                        всех наших пользователей, чтобы наши члены могли лучше понимать и оценивать игры.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Мы приглашаем вас в наше игровое сообщество, где вас ждет множество возможностей для роста,
                        развития
                        и удовольствия в кругу единомышленников! Вы всегда найдете у нас всё, что нужно для воплощения в
                        жизнь самых темных и фантастических исканий!
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <iframe src="https://discord.com/widget?id=431848130041085992&theme=dark" width="100%" height="530"
                            allowTransparency frameBorder="0"
                            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Button
                        variant="contained"
                        style={{backgroundColor: '#293F5A', color: 'white'}}
                        className={classes.socialButton}
                        href="http://steamcommunity.com/groups/ZMXcmnt"
                        target="_blank"
                    >
                        Steam
                    </Button>
                    <Button
                        variant="contained"
                        style={{backgroundColor: '#28A8E9', color: 'white'}}
                        className={classes.socialButton}
                        href=""
                        target="_blank"
                    >
                        Telegram
                    </Button>
                    <Button
                        variant="contained"
                        style={{backgroundColor: '#5865F2', color: 'white'}}
                        className={classes.socialButton}
                        href="https://discord.gg/ygJHccvj"
                        target="_blank"
                    >
                        Discord
                    </Button>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Box>
                        <ImageList variant="masonry" cols={3} gap={8}>
                            {imageUrls.map((url) => (
                                <ImageListItem key={url.img} cols={url.cols} rows={url.rows}>
                                    <img {...srcset(url.img, 121, url.rows, url.cols)}
                                         src={url.img}
                                         alt="photoGaleryHomePage"
                                         loading="lazy"/>
                                </ImageListItem>
                            ))}
                        </ImageList>

                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}