import { useEffect, useState } from "react";

const Notification = ({notification, setNotification}) => {
    let message = notification.message
    useEffect(() => {
        if(message) {
            setTimeout(() => {
                setNotification({
                    message: null,
                    type: ""
                })
            }, 5000)
        }
    }, [notification])

    const styles = {
        info: {
            color: 'green',
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10
        },
        error: {
            color: 'red',
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10 
        }
    }

    if(notification.message === null) {
        return null
    }

    return (
        <div style={notification.type === 'error' ? styles.error : styles.info}>
            {message}
        </div>
    )
}

export default Notification
