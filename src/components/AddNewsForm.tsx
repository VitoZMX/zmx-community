import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import AddIcon from '@mui/icons-material/Add'

export function AddNewsForm() {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <Button variant="outlined"
                    onClick={handleClickOpen}
                    style={{marginBottom: '10px'}}>
                <AddIcon/>
                Add news
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>What's new?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Что бы добавить новость на сайт, пожалйста, заполните все поля.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Заголовок новости"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        id="text"
                        label="Расскажите что нового подробнее."
                        type="text"
                        fullWidth
                        multiline
                        rows={7}
                    />
                    <Button variant="outlined" component="label" style={{marginTop: '10px'}}>
                        Прикрепить файл обложки
                        <input type="file" hidden/>
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}