import { useState, useEffect } from 'react'

const Notification = ({notificationMessage, setNotification}) => {
    let message = notificationMessage.message
    useEffect(() => {
        if(message) {
            setTimeout(() => {
                setNotification({
                    message: null,
                    type: ""
                  })
            }, 5000)
        }
    },[notificationMessage])

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

    if (notificationMessage.message === null) {
        return null
    }

    return (
        <div style={notificationMessage.type === 'error' ? styles.error : styles.info}>
            {message}
        </div>
    )
}

export default Notification