import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { UserContext } from '../../context/context';
import axios from 'axios';


function Task() {
    const { user, loading } = useContext(UserContext)
    const [checkList, setCheckList] = useState([])
    useEffect(() => {
        async function startFetching() {
            try {
                if (!loading) {
                    const response = await axios.get(`/users/allTasks/${user.id}`);
                    setCheckList(response.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        startFetching()
    }, [loading])

    async function fetchTask() {
        try {
          if (!loading) {
            const response = await axios.get(`/users/allTasks/${user.id}`);
            setCheckList(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      }

    const handleToggle = (value) => async () => {
        try{
            let data = {
                index:value,
                value:'',
                userid:user.id
            }
            const response = await axios.post(`/users/taskChange`,data);
            fetchTask()
        }catch(error){
            console.log(error)
        }
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: "#5932EA",
            },
            secondary: {
                main: "#000000",
            }
        },
    });

    const formBlur = async (event) => {
        try{
            let data = {
                index:event.target.name,
                value:event.target.value,
                userid:user.id
            }
            const response = await axios.post(`/users/taskChange`,data);
        }catch(error){
            console.log(error)
        }
    }

    const formChange = (event)=>{
        const updatedCheckList = [...checkList];
        updatedCheckList[event.target.name] = event.target.value
        setCheckList(updatedCheckList);
    }
    return (
        <>
            <h1 className="DS-Task-header">Check List</h1>
            <ThemeProvider theme={theme}>
                <List sx={{ width: '90%', bgcolor: 'background.paper' }}>
                    {checkList.map((item,index) => {
                        return (
                            <ListItem
                                key={index}
                                sx={{ maxWidth: "true", maxHeight: "true", borderRadius: "30px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)", margin: "5%" }}
                            >
                                <Button
                                    onClick={handleToggle(index)}>
                                    <Checkbox
                                        tabIndex={index}
                                        disableRipple
                                    />
                                </Button>
                                <TextField value = {item} name={"" + index} id="outlined-basic" variant="outlined" onChange={formChange} onBlur={formBlur} sx={{ "& fieldset": { border: 'none' }, width: '100%' }} />
                            </ListItem>
                        );
                    })}
                </List>
            </ThemeProvider>
        </>
    )
}
export default Task;
