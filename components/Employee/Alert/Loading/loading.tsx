import { useState } from 'react';
import styles from './loading.module.css'
interface LoadingProps{
    loading:boolean,
    message:string
}
export default function Loading(loading:boolean, message:string){
    return(
        <div>
            {loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loader}>
                <div style={{ width:'80%'}}>
                    <p className={styles.title}>{message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
    )
}