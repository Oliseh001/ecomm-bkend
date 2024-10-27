import { IsString, matches, MATCHES, Matches, MaxLength, MinLength, minLength } from "class-validator";

export class AuthCredentialsDto{
    @IsString()
    @Matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~`|])(?!.*\s)$/,
        {message: 'Password too weak'}
        )
    password: string;
}