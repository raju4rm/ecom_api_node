 
const  dateFormateForDB=(inputDate=null) => {
        let date;
        if(inputDate){
                date = new Date(inputDate);  
        }else{
                date = new Date();    
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0'); 
        return `${year}-${month}-${day}`; 
}
const dateFormateForFrontEnd= (inputDate=null) => {
        let date;
        if(inputDate){
                date = new Date(inputDate);  
        }else{
                date = new Date();    
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0'); 
        return `${day}/${month}/${year}`; 
}
module.exports = {
        dateFormateForDB,
        dateFormateForFrontEnd
}




