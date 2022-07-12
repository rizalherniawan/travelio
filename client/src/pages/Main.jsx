import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar
} from '@mui/material'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import { pink } from '@mui/material/colors'
import IconButton from '@mui/material/IconButton'
import { useToast } from '../contexts/toastContext'



export default function Main() {
    const [data,setData] = useState([])
    const [authors,setAuthors] = useState([])
    const [thumbnails,setThumbnails] = useState([])
    const [search, setSearch] = useState('')
    const [load, setLoad] = useState(true)
    const {toast, setToast} = useToast()
    const [view, setView] = useState([])
    const [open, setOpen] = useState(false)


    const getData = async(key) => {
        try {
            if(!key){
                setLoad(false)
                setData(null)
            } else {
                const url = `https://www.googleapis.com/books/v1/volumes?q=${key}`
                const res = await (await fetch(url, {
                method: 'GET',
            })).json()
            setLoad(true)
            setOpen(false)
            let newData = res.items
            setAuthors(newData.map(val => val.volumeInfo.authors === undefined ? null : val.volumeInfo.authors.join(', ')))
            setThumbnails(newData.map(val => val.volumeInfo.hasOwnProperty('imageLinks') === false ? 
                'https://simlitbangdiklat.kemenag.go.id/simlitbang/assets_front/images/no_image.jpg' : val.volumeInfo.imageLinks.thumbnail
            ))
            setData(res.items.map(val => val.volumeInfo))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const trigger = async() => {
        setOpen(!open)
        setLoad(false)
        const url = 'http://localhost:5000/api/v1/wishlist'
        const res = await (await fetch(url, {
            method: 'GET',
        })).json()
        console.log(res.data)
        setView(res.data)
    }

    const toggle = async(book_idn,name,rating,thumbnail) => {
        const res = await fetch('http://localhost:5000/api/v1/wishlist', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                rating: rating,
                thumbnail: thumbnail === undefined ? 'https://simlitbangdiklat.kemenag.go.id/simlitbang/assets_front/images/no_image.jpg' : thumbnail,
                book_idn: book_idn
            }),
            headers: {"Content-Type": "application/json"} 
        })
        const data = await res.json()
        if(res.status === 200){
            setToast(({
                open: true,
                msg: data.message,
                bgColor: 'success.main'
            }))
        } else {
            setToast({
              open: true,
              msg: data.message,
              bgColor: 'error.main'
            })
        }
    }

    const deleteItem = async(id) => {
        await fetch('http://localhost:5000/api/v1/wishlist', {
            method: 'DELETE',
            body: JSON.stringify({
                book_idn: id
            }),
            headers: {"Content-Type": "application/json"} 
        })
        window.location.reload()
    }

    const closeSnackbar = (event, reason) => {
        if (reason === 'clickaway') { return; }
        setToast(prev => ({...prev, open: false}));
    };


    useEffect(() => {
        getData()
    },[])



    return(
        <>
            <div style = {{textAlign: 'center', marginTop:'75px'}}><input type = "text" style = {{height:'30px', width:'500px'}} placeholder='Type in what books you want to search'
                onChange={(e) => setSearch(e.target.value)}/>
                <Button style = {{marginLeft:'15px'}} variant="contained" onClick={() => getData(search)}>SEARCH</Button>
                <IconButton onClick={() => trigger()}><FavoriteRoundedIcon sx={{color: pink[500], fontSize: 40 }}/></IconButton>
            </div>
            {load === false ? <div></div> : 
                 <TableContainer component={Paper} sx = {{width: 1000, mx: "auto", mt: 4}}>
                 <Table sx={{ minWidth: 900, mt: 3 }} aria-label="simple table">
                     <TableHead>
                     <TableRow>
                        <TableCell align="center">Judul</TableCell>
                        <TableCell align="center">Gambar</TableCell>
                        <TableCell align="center">Author</TableCell>
                        <TableCell align="center">Rating</TableCell>
                        <TableCell align="center">Adding To Wishlist</TableCell>
                     </TableRow>
                     </TableHead>
                     <TableBody>
                        {data.map((datum,index) => (
                            <TableRow>
                                <TableCell align="center">{datum.title}</TableCell>
                                <TableCell align="center"><img src={`${thumbnails[index]}`} width={100} height={100} alt='Book Covers'/></TableCell>
                                <TableCell align="center">{authors[index]}</TableCell>
                                <TableCell align="center"><Rating name="half-rating-read" defaultValue={datum.averageRating} precision={0.5} readOnly/></TableCell>
                                <TableCell align="center"><IconButton onClick = {() => toggle(datum.industryIdentifiers[0].identifier, datum.title, datum.averageRating, 
                                    datum.hasOwnProperty('imageLinks') === false ?
                                    'https://simlitbangdiklat.kemenag.go.id/simlitbang/assets_front/images/no_image.jpg' :
                                    datum.imageLinks.thumbnail
                                    )}>
                                    <FavoriteBorderRoundedIcon sx={{color: pink[500] }}/></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                     </TableBody>
                 </Table>
             </TableContainer>
            }
            {open === false ? <div></div> :
                <TableContainer component={Paper} sx = {{width: 1000, mx: "auto", mt: 4}}>
                    <Table sx={{ minWidth: 900, mt: 3 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">Judul</TableCell>
                            <TableCell align="center">Gambar</TableCell>
                            <TableCell align="center">Rating</TableCell>
                            <TableCell align="center">Hapus Wishlist</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {view.map((datum) => (
                            <TableRow>
                                <TableCell align="center">{datum.name}</TableCell>
                                <TableCell align="center"><img src={`${datum.thumbnail}`} width={100} height={100} alt='Book Covers'/></TableCell>
                                <TableCell align="center"><Rating name="half-rating-read" defaultValue={datum.rating} precision={0.5} readOnly/></TableCell>
                                <TableCell align="center"><IconButton onClick = {() => deleteItem(datum.book_idn)}><DeleteOutlineIcon/></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            <Snackbar
                open={toast.open}
                autoHideDuration={1000}
                onClose={closeSnackbar}
                message={toast.msg}
                {
                    ...(toast.bgColor)
                    ? {sx: {'& div': { backgroundColor: toast.bgColor }}}
                    : {}
                }
            />
        </>
    )
}