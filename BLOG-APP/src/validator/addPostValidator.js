const addPostValidator = ({title,content,category})=>{
    const errors = {
        title: "",
        content: "",
        category : ""
    };


    if (!title) {
        errors.title = "Title is required";
    } 

    if (!content) {
        errors.content = "Content is required";
    } 

    if (!category) {
        errors.category = "Category is required";
    } 

    return errors
}

export default addPostValidator;