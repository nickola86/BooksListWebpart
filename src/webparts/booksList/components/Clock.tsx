import * as React from 'react'
import { useEffect } from 'react'
import styles from './Clock.module.scss'
export const Clock = (): JSX.Element => {
    useEffect(()=>{
        const time = new Date();
        const hour = -3600 * (time.getHours() % 12);
        const mins = -60 * time.getMinutes();
        document.getElementById("clock-board").style.setProperty('--_dm', `${mins}s`);
        document.getElementById("clock-board").style.setProperty('--_dh', `${(hour+mins)}s`); 
    },[])
    return <div className={styles.clock}>
        <div className={styles.clockFace} id="clock-board">
            <time dateTime="12:00">12</time>
            <time dateTime="1:00">1</time>
            <time dateTime="2:00">2</time>
            <time dateTime="3:00">3</time>
            <time dateTime="4:00">4</time>
            <time dateTime="5:00">5</time>
            <time dateTime="6:00">6</time>
            <time dateTime="7:00">7</time>
            <time dateTime="8:00">8</time>
            <time dateTime="9:00">9</time>
            <time dateTime="10:00">10</time>
            <time dateTime="11:00">11</time>
            <span className={styles.arm+' '+styles.seconds}></span>
            <span className={styles.arm+' '+styles.minutes}></span>
            <span className={styles.arm+' '+styles.hours}></span>
        </div>
    </div>
} 