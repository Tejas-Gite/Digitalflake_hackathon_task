import { AbstractControl } from "@angular/forms";

export function passwordMatch(password:string, confirmPassword:string){

    return function(form:AbstractControl)
    {
        const passwordValue = form.get('password')?.value;
        const confirmPasswordValue = form.get('re_enter_password')?.value;

        if(passwordValue == confirmPasswordValue)
        {
            return null;
        }
        else{
            return {passwordMissmatchError:true}
        }
    }
}