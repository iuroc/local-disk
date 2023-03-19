import express from 'express'
import router from './router'
router(express()).listen(3000)
console.log('http://127.0.0.1:3000')