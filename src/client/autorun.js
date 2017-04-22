import mobx from "mobx"

// Required for client side title and description change, you can add more
//-----------
 export default (coupon) => mobx.autorun(()=>{
     document.title = coupon.offer.title
     document.querySelector("meta[name='description']").content = coupon.offer.description
 })