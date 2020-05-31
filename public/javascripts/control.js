function validaForm(){
    if(document.form_registrazione.password1.value != document.form_registrazione.password2.value){
        alert("Le password non combaciano");
        return false;
    }
    else
        return true;
}