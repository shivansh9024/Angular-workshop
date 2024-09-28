import { Component } from '@angular/core';
import { Appointment } from '../models/appointment';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit {
  newAppointmentTitle: string = '';
  newAppointmentDate: Date = new Date();

  appointments: Appointment[] = [];
  isEditing: boolean = false;
  currentAppointmentIndex: number | null = null;
  editAppointmentTitle: string = '';
  editAppointmentDate: Date = new Date();

  notificationMessage: string = '';
  notificationType: 'success' | 'error' | '' = '';

  ngOnInit(): void {
    let savedAppointments = localStorage.getItem('appointments-key');
    this.appointments = savedAppointments ? JSON.parse(savedAppointments) : [];
  }

  addAppointment() {
    if (!this.newAppointmentTitle.trim().length) {
      this.setNotification('Appointment title cannot be empty', 'error');
      return;
    }

    const currentDate = new Date().setHours(0, 0, 0, 0);
    if (new Date(this.newAppointmentDate).setHours(0, 0, 0, 0) < currentDate) {
      this.setNotification('Appointment date cannot be in the past', 'error');
      return;
    }

    let newAppoint: Appointment = {
      id: Date.now(),
      title: this.newAppointmentTitle,
      date: this.newAppointmentDate,
    };
    this.appointments.push(newAppoint);
    this.newAppointmentTitle = '';
    this.newAppointmentDate = new Date();
    localStorage.setItem('appointments-key', JSON.stringify(this.appointments));

    this.setNotification('Appointment added successfully!', 'success');
  }

  deleteAppointment(index: number) {
    this.appointments.splice(index, 1);
    localStorage.setItem('appointments-key', JSON.stringify(this.appointments));
    this.setNotification('Appointment deleted successfully!', 'success');
  }

  editAppointment(index: number) {
    this.isEditing = true;
    this.currentAppointmentIndex = index;
    const appointment = this.appointments[index];
    this.editAppointmentTitle = appointment.title;
    this.editAppointmentDate = new Date(appointment.date);
  }

  saveAppointment() {
    if (this.currentAppointmentIndex !== null) {
      if (!this.editAppointmentTitle.trim().length) {
        this.setNotification('Appointment title cannot be empty', 'error');
        return;
      }

      const currentDate = new Date().setHours(0, 0, 0, 0);
      if (new Date(this.editAppointmentDate).setHours(0, 0, 0, 0) < currentDate) {
        this.setNotification('Appointment date cannot be in the past', 'error');
        return;
      }

      this.appointments[this.currentAppointmentIndex].title = this.editAppointmentTitle;
      this.appointments[this.currentAppointmentIndex].date = this.editAppointmentDate;
      localStorage.setItem('appointments-key', JSON.stringify(this.appointments));

      this.isEditing = false;
      this.currentAppointmentIndex = null;
      this.editAppointmentTitle = '';
      this.editAppointmentDate = new Date();

      this.setNotification('Appointment updated successfully!', 'success');
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.currentAppointmentIndex = null;
    this.editAppointmentTitle = '';
    this.editAppointmentDate = new Date();
  }

  setNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationType = '';
    }, 3000);
  }
}
