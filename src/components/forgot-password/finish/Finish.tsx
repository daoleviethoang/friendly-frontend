import { Icon } from "@iconify/react";
import * as React from "react";
import classes from "./Finish.module.css";
export interface FinishProps {
    userLastName: string;
    message: string;
}

export default function Finish({ userLastName, message }: FinishProps) {
    const [counter, setCounter] = React.useState(5);

    React.useEffect(() => {
        counter > 0 ? setTimeout(() => setCounter(counter - 1), 1000) : login();
    }, [counter]);

    const login = () => {
        console.log("Login");
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.inform}>
                <Icon icon="akar-icons:circle-check-fill" className={classes.icon} />
                <div className={classes.content}>
                    {userLastName} thân mến,
                    <div>Chúc mừng bạn đã {message} thành công</div>
                </div>
            </div>
            <div className={classes["btn-wrapper"]}>
                <button className={classes["btn-auto-log"]} onClick={login}>
                    Tự động đăng nhập ({counter})
                </button>
            </div>
        </div>
    );
}
