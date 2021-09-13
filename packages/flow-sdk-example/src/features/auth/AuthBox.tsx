import React from "react"
import styles from "../counter/Counter.module.css"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { login, logout, selectAuth, signup } from "./authSlice"

export function AuthBox() {
	const dispatch = useAppDispatch()
	const auth = useAppSelector(selectAuth)

	if (auth.loggedIn) return (
		<div>
			<div className={styles.row}>
				<span className={styles.value}>{auth.address}</span>
				<button
					className={styles.button}
					disabled={auth.status === "loading"}
					aria-label="Decrement value"
					onClick={() => dispatch(logout())}
				>
					Logout
				</button>
			</div>
		</div>
	)
	else return (
		<div>
			<div className={styles.row}>
				<button
					className={styles.button}
					disabled={auth.status === "loading"}
					aria-label="Decrement value"
					onClick={() => dispatch(login())}
				>
					Login
				</button>
				<button
					className={styles.button}
					disabled={auth.status === "loading"}
					aria-label="Increment value"
					onClick={() => dispatch(signup())}
				>
					SignUp
				</button>
			</div>
		</div>
	)
}
