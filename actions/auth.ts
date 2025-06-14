
'use server';

import { cookies } from 'next/headers';



export const logOut = async() =>{
    const cookiesStore = await cookies()
    cookiesStore.set('admin-token', '', {
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    path:'/',
    maxAge:0,

    })
}