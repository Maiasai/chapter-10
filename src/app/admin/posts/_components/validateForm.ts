// //バリデーションエラー（管理画面　新規作成・編集）


// interface PostFormData {
//     title : string
//     content : string
//     categories : {id:number; name:string}[]
//     thumbnailImageKey : string
//   }
  
//   interface PostFormErrors {
//     title? : string
//     content? : string
//     categories? : string
//     thumbnailImageKey? : string 
//   }

// const ValidateForm = () => {

//     const validateForm = (formData:PostFormData) : PostFormErrors => {
//         const errors : PostFormErrors = {};
    
//         if(!formData.title.trim()){
//         errors.title = "タイトルは必須です"
//         }
//         if(!formData.content.trim()){
//         errors.content = "内容は必須です"
//         }
//         if(!formData.thumbnailImageKey){
//         errors.thumbnailImageKey = "画像は必須です"
//         }
//         if(formData.categories.length === 0){
//         errors.categories = "カテゴリを選択してください"
//         }
        
//         return errors;
//     }
//     return {validateForm};
// }

// export default ValidateForm;