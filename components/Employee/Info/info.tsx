'use client'
import styles from './info.module.css'
import SideBar from '../SideBar/sideBar'
import { useState } from 'react'
export default function Info(){
    const [user, setUser] = useState<any>({})
    console.log(user)
    return(
        <div>
            <SideBar setUser = {setUser}/>
        </div>
    )
} 