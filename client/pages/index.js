import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { BiUserPlus } from "react-icons/bi";
import "antd/dist/antd.css";
import {Button, Table} from 'antd';
import { useEffect, useState } from 'react';
import Popup from '../components/popup/Popup';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../helper/fetcher';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  const [ visibleAdd, setAddVisible ] = useState(false);
  const [ visibleEdit, setEditVisible ] = useState(false);
  const [info, setInfo ] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setpage] = useState(1)
  const [size, setsize] = useState(2)
  
  //to fetch data
  const { data, error } = useSWR(`http://localhost:8800/employee?page=${page}&limit=${size}`, fetcher);
    //to handle visiblty of form when click on add employee button.
  console.log("data");
  console.log(data);
    const visibleAddhandler = () => {
    setAddVisible(true);
  }
  const visibleEdithandler = () => {
    setEditVisible(true);
  }
  //useEffect
 
  useEffect( () => {
    mutate('http://localhost:8800/employee');
  },[page,size]);

  //to delete employee
  axios.defaults.baseURL = 'http://localhost:8800';
const deleteEmployee = (record) => {
      axios.delete(`/employee/${record.id}`)
      .then(function (response) {
        mutate('http://localhost:8800/employee');
        toast("Employee Deleted Successfully", {type: 'success'});
        console.log(response);
      }).catch(function (error) {
        console.log("rrrrr");
        console.log(error);
      });
}
      
  const dataSource = data ? data.items : [];
  // const dataSource = data;
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
        title: 'Job-title',
        dataIndex: 'job_title',
        key: 'job_title',
    },
    {
        title: 'department',
        dataIndex: 'department',
        key: 'department',
        render: (_, record) => {
          console.log("record");
          console.log(record);
          return (
            <>
             { record?.department_?.name}
            </>
          )
        }
    },
    {
      title: 'Actions',
      render: (_, record) => {
        //console.log("record: " + record.name);
        return (
          <>
            <Button onClick ={() => {
              visibleEdithandler()
              setInfo(record)
               } 
            }  className='flex edit-button'>Edit</Button>
            <Button className='flex delete-button' onClick={() => {
               deleteEmployee(record)}
            }>Delete</Button>
          </>
        )
      }
  },
  ];
  return (
    <section className={styles.container}>
      <Head>
        <title>Employee Managment</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='py-5'>
         <h1 className='text-xl md:text-5xl text-center font-bold py-10'>Employee Managment</h1>
         <div className='container mx-auto flex justify-between py-5 border-b'>
           <div className="left flex gap-3">
              <button onClick={visibleAddhandler} className='flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:border-indigo-500 hover:text-gray-800'>
                Add Employee 
                <span  className='px-1'><BiUserPlus size={23}></BiUserPlus></span>
              </button>
           </div>
         </div>
         {/* table */}
         <Table dataSource={dataSource}  columns={columns} 
         pagination={{
          total: data?.meta?.totalItems,
          defaultPageSize: 2,
          onChange: (page, size) =>{
              setpage(page)
              setsize(size)
          }
         }} 

         />
         {/* <div className="container mx-auto py-5"> */}
             {visibleAdd ? <Popup setAddVisible={setAddVisible} trigger = {true} add={true} edit={false} /> : <></>}
             {visibleEdit ? <Popup setEditVisible={setEditVisible} info={info} trigger = {true} edit={true} add={false} /> : <></>}
        
         {/* </div> */}
      </main>
    </section>
  )
}
