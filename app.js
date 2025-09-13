class SchoolCalendar {
    constructor() {
        // Dati del calendario scolastico
        this.schoolYear = {
            start: new Date('2025-09-12'),
            end: new Date('2026-06-08')
        };
        
        // Data target per il countdown (fine anno scolastico)
        this.countdownTarget = new Date('2026-06-08T23:59:59');
        
        this.holidays = [
            {
                name: "Festa di tutti i Santi",
                start: new Date('2025-11-01'),
                end: new Date('2025-11-01')
            },
            {
                name: "Festa Immacolata Concezione",
                start: new Date('2025-12-08'),
                end: new Date('2025-12-08')
            },
            {
                name: "Vacanze di Natale ed Epifania",
                start: new Date('2025-12-22'),
                end: new Date('2026-01-06')
            },
            {
                name: "Carnevale",
                start: new Date('2026-02-16'),
                end: new Date('2026-02-17')
            },
            {
                name: "Vacanze di Pasqua",
                start: new Date('2026-04-02'),
                end: new Date('2026-04-07')
            },
            {
                name: "Festa della Liberazione",
                start: new Date('2026-04-25'),
                end: new Date('2026-04-25')
            },
            {
                name: "Festa del Lavoro",
                start: new Date('2026-05-01'),
                end: new Date('2026-05-02')
            },
            {
                name: "Festa Nazionale della Repubblica",
                start: new Date('2026-06-01'),
                end: new Date('2026-06-02')
            }
        ];

        // Data simulata per il calendario (può essere diversa dalla data reale)
        this.simulatedDate = new Date('2025-09-13');
        this.viewDate = new Date('2025-09-01');
        this.monthNames = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];

        // Variabile per l'intervallo del countdown
        this.countdownInterval = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCalendar();
        this.renderHolidaysList();
        this.startCountdown();
    }

    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.viewDate.setMonth(this.viewDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.viewDate.setMonth(this.viewDate.getMonth() + 1);
            this.renderCalendar();
        });

        document.getElementById('updateTodayBtn').addEventListener('click', () => {
            // Aggiorna la data simulata per il calendario
            this.simulatedDate = new Date();
            this.renderCalendar();
        });
    }

    // Funzioni del countdown - usa sempre la data reale
    startCountdown() {
        // Aggiorna immediatamente
        this.updateCountdown();
        
        // Aggiorna ogni secondo
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        // Usa sempre la data reale corrente per il countdown
        const now = new Date();
        const timeLeft = this.countdownTarget.getTime() - now.getTime();
        
        const countdownBox = document.querySelector('.countdown-box');
        const daysElement = document.getElementById('daysRemaining');
        const textElement = document.getElementById('countdownText');
        
        if (timeLeft <= 0) {
            // Anno scolastico terminato
            daysElement.textContent = '🎉';
            textElement.textContent = 'Anno scolastico terminato!';
            countdownBox.classList.add('countdown-finished');
            
            // Ferma il countdown
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
        } else {
            // Calcola i giorni rimanenti
            const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
            
            daysElement.textContent = daysLeft.toLocaleString('it-IT');
            
            if (daysLeft === 1) {
                textElement.textContent = 'giorno alla fine dell\'anno scolastico';
            } else {
                textElement.textContent = 'giorni alla fine dell\'anno scolastico';
            }
            
            // Rimuovi la classe finished se presente
            countdownBox.classList.remove('countdown-finished');
        }
    }

    // Funzioni del calendario - usa la data simulata
    isDateInRange(date, start, end) {
        return date >= start && date <= end;
    }

    isHoliday(date) {
        // Controlla se è domenica
        if (date.getDay() === 0) {
            return true;
        }

        // Controlla le interruzioni scolastiche
        return this.holidays.some(holiday => 
            this.isDateInRange(date, holiday.start, holiday.end)
        );
    }

    isWeekend(date) {
        const day = date.getDay();
        return day === 6 || day === 0; // Sabato o Domenica
    }

    isInSchoolYear(date) {
        return this.isDateInRange(date, this.schoolYear.start, this.schoolYear.end);
    }

    isPastDate(date) {
        // Usa la data simulata per determinare i giorni passati nel calendario
        const today = new Date(this.simulatedDate);
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    }

    isToday(date) {
        // Usa la data simulata per evidenziare "oggi" nel calendario
        const today = new Date(this.simulatedDate);
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    getDayType(date, isCurrentMonth) {
        if (!isCurrentMonth) {
            return 'day-other-month';
        }

        if (!this.isInSchoolYear(date)) {
            return 'day-out-of-range';
        }

        let classes = [];

        if (this.isToday(date)) {
            classes.push('day-today');
        } else if (this.isHoliday(date)) {
            classes.push('day-holiday');
        } else if (this.isWeekend(date)) {
            classes.push('day-weekend');
        } else {
            classes.push('day-normal');
        }

        if (this.isPastDate(date) && !this.isToday(date)) {
            classes.push('day-passed');
        }

        return classes.join(' ');
    }

    renderCalendar() {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        // Aggiorna il titolo del mese
        document.getElementById('currentMonth').textContent = 
            `${this.monthNames[month]} ${year}`;

        // Calcola il primo giorno del mese e quanti giorni ha
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Calcola il giorno della settimana del primo giorno (0 = domenica, ma vogliamo lunedì = 0)
        let startDay = firstDay.getDay() - 1;
        if (startDay === -1) startDay = 6;

        // Calcola i giorni del mese precedente da mostrare
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();

        const calendarGrid = document.querySelector('.calendar-grid');
        
        // Rimuovi tutti i giorni esistenti (mantieni solo le intestazioni)
        const dayElements = calendarGrid.querySelectorAll('.calendar-day');
        dayElements.forEach(el => el.remove());

        // Aggiungi i giorni del mese precedente
        for (let i = startDay - 1; i >= 0; i--) {
            const dayNum = prevMonthDays - i;
            const date = new Date(year, month - 1, dayNum);
            const dayElement = this.createDayElement(dayNum, this.getDayType(date, false));
            calendarGrid.appendChild(dayElement);
        }

        // Aggiungi i giorni del mese corrente
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayElement = this.createDayElement(day, this.getDayType(date, true));
            calendarGrid.appendChild(dayElement);
        }

        // Aggiungi i giorni del mese successivo per completare la griglia
        const totalCells = calendarGrid.children.length - 7; // Sottrai le intestazioni
        const remainingCells = 42 - totalCells; // 6 righe x 7 giorni - celle già occupate
        
        for (let day = 1; day <= remainingCells; day++) {
            const date = new Date(year, month + 1, day);
            const dayElement = this.createDayElement(day, this.getDayType(date, false));
            calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(dayNum, className) {
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${className}`;
        dayElement.textContent = dayNum;
        dayElement.setAttribute('tabindex', '0');
        return dayElement;
    }

    formatDateRange(start, end) {
        const startStr = start.toLocaleDateString('it-IT', { 
            day: 'numeric', 
            month: 'long' 
        });
        
        if (start.getTime() === end.getTime()) {
            return startStr;
        }

        const endStr = end.toLocaleDateString('it-IT', { 
            day: 'numeric', 
            month: 'long',
            year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
        });

        return `${startStr} - ${endStr}`;
    }

    renderHolidaysList() {
        const holidaysList = document.getElementById('holidaysList');
        holidaysList.innerHTML = '';

        // Aggiungi una nota per le domeniche
        const sundayItem = document.createElement('li');
        sundayItem.innerHTML = `
            <span class="holiday-name">Tutte le domeniche</span>
            <span class="holiday-date">Durante l'anno scolastico</span>
        `;
        holidaysList.appendChild(sundayItem);

        // Aggiungi le altre interruzioni
        this.holidays.forEach(holiday => {
            const listItem = document.createElement('li');
            const dateRange = this.formatDateRange(holiday.start, holiday.end);
            
            listItem.innerHTML = `
                <span class="holiday-name">${holiday.name}</span>
                <span class="holiday-date">${dateRange}</span>
            `;
            holidaysList.appendChild(listItem);
        });
    }

    // Cleanup quando necessario
    destroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
}

// Inizializza il calendario quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    window.schoolCalendar = new SchoolCalendar();
});

// Cleanup quando la pagina viene scaricata
window.addEventListener('beforeunload', () => {
    if (window.schoolCalendar) {
        window.schoolCalendar.destroy();
    }
});