'use client'
import GeneralGraph from '@/component/GeneralGraph';
import OneGraph from '@/component/OneGraph';
import PageTitle from '@/component/PageTitle'
import { Button } from 'antd'
import React, { useState } from 'react'


function Query() {
  const [showGeneral, setShowGeneral] = useState(false);
  const [showOne, setShowOne] = useState(false);

  const handleGeneralButtonClick = () => {
    setShowGeneral(true);
    setShowOne(false);
  }

  const handleOneButtonClick = () => {
    setShowGeneral(false);
    setShowOne(true);
  }

  return (
    <div className='my-3'>
      <PageTitle title='New Product'/>
      <div className='flex flex-col items-center'>
        <div className='flex justify-center lg: w-3/4 md:w-2/3 sm:1/2'>
          <Button type='primary' block onClick={handleOneButtonClick} className='mx-3'>
            <i className="ri-bar-chart-2-fill">&nbsp;One Product</i>
          </Button> 
          <Button type='primary' block onClick={handleGeneralButtonClick} className='mx-3'>
            <i className="ri-line-chart-line">&nbsp;General</i>
          </Button> 

          
        </div>

        <div className='mt-6 lg: w-1/4 md:w-1/3 sm:1/2'>
          {showOne && <OneGraph/>}
          {showGeneral && <GeneralGraph />}
        </div>

      </div>
    </div>
  )
}

export default Query