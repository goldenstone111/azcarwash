import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './authGuard/auth-guard-service.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuardService] 
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./pages/forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordPageModule)
  },
  {
    path: 'signIn',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInPageModule)
  },
  { 
    path: 'signUp',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'addCar',
    loadChildren: () => import('./pages/add-car/add-car.module').then(m => m.AddCarPageModule)
  },
  {
    path: 'addAddress',
    loadChildren: () => import('./pages/add-address/add-address.module').then(m => m.AddAddressPageModule)
  },
  {
    path: 'locationDetail',
    loadChildren: () =>
      import('./pages/location-detail/location-detail.module').then(
        m => m.LocationDetailPageModule
      )
  },
  {
    path: 'confirmBooking',
    loadChildren: () => import('./pages/confirm-booking/confirm-booking.module').then(m => m.ConfirmBookingPageModule)
  },
  {
    path: 'bookingSuccess',
    loadChildren: () => import('./pages/booking-success/booking-success.module').then(m => m.BookingSuccessPageModule)
  },
  {
    path: 'myBookings',
    loadChildren: () => import('./pages/my-bookings/my-bookings.module').then(m => m.MyBookingsPageModule)
  },
  {
    path: 'addReview',
    loadChildren: () => import('./pages/add-review/add-review.module').then(m => m.AddREviewPageModule)
  },
  {
    path: 'myCars',
    loadChildren: () => import('./pages/my-cars/my-cars.module').then(m => m.MyCarsPageModule)
  },
  {
    path: 'contactUs',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule)
  },
  {
    path: 'favorite',
    loadChildren: () => import('./pages/favorite/favorite.module').then(m => m.FavoritePageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then(m => m.PaymentPageModule)
  },{
    path: 'pickupAddress',
    loadChildren: () => import('./pages/pickup-address/pickup-address.module').then( m => m.PickupAddressPageModule)
  },
  {
    path: 'viewBooking',
    loadChildren: () => import('./pages/view-booking/view-booking.module').then( m => m.ViewBookingPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./verify/verify.module').then( m => m.VerifyPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'aboutUs',
    loadChildren: () => import('./pages/about-us/about-us.module').then( m => m.AboutUsPageModule)
  }
];

@NgModule({ 
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
