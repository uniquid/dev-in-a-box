import React from 'react'

const QrCode = ({visibility, sessionQrcode}) => (
    <section className={visibility === false ? 'wrapper_qrcode' : 'wrapper_qrcode hidden'}>
        <h1 className='qrcode_title'>Uniquid Console <span className='title_release'>Alpha</span></h1>
        <h3 className='qrcode_tagline'>A blockchain access management that protect <br /> your digital connected assets inside a network <br /> of smart devices and people</h3>
        <div className='qrcode_body' dangerouslySetInnerHTML={{__html: sessionQrcode}}></div>
        <p className='qrcode_instruction'>Scan the QRcode above with the Uniquid app to Login</p>
        <div className='qrcode_version'>v. 0.2.4</div>
    </section>
)

export default QrCode
