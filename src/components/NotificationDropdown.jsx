import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '../styles/NotificationDropdown.module.css';

export default function NotificationDropdown({ visible, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (visible) {
            axios.get('http://localhost:3000/notificaciones')
                .then(response => setNotifications(response.data.notificaciones))
                .catch(error => console.error('Error al obtener notificaciones:', error));
        }
    }, [visible]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose(); // Cierra el dropdown si se hace clic fuera
            }
        };

        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <div ref={dropdownRef} className={styles.dropdown}>
            <h4>Notificaciones</h4>
            {notifications.length === 0 ? (
                <p className={styles.noNotificationsText}>No hay notificaciones pendientes.</p>
            ) : (
                <ul>
                    {notifications.map((n) => (
                        <li key={n.numDoc} className={styles.notificationItem}>
                            Estudiante {n.primerNombre} {n.primerApellido} (Doc. {n.numDoc}) tiene {n.inasistencias} inasistencias.
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}