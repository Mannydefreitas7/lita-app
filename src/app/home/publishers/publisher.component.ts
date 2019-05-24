import { Component, OnInit } from '@angular/core';
import { PublisherService } from './publisher.service';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Publisher } from 'src/app/shared/models/congregation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DeletepublisherComponent } from './deletepublisher.component';
import { AuthService } from 'src/app/core/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lita-publisher',
  templateUrl: './html/publisher.component.html',
  styleUrls: ['./scss/publishers.component.scss']
})
export class PublisherComponent implements OnInit {
  sub: any;
  uid: any;
  user;
  edit: boolean = false;
  publisher: Observable<Publisher>;
  pubRoute: any;
  publisherForm: FormGroup;
  email: string;
  emailSent = false;
  errorMessage: string;
  roles = [
    {value: 'admin', valueView: 'Admin'},
    {value: 'editor', valueView: 'Editor'}
  ];
  selected = 'publisher';


  constructor(
    private publisherService: PublisherService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private dashService: DashboardService
    ) {}

  editField() {
    this.publisherForm.enable();
    this.edit = true;
  }

  cancelEdit() {
    this.publisherForm.disable();
    this.edit = false;
  }

      // -- Update current Publisher -- //
      updatePublisher() {
        const fname = this.publisherForm.get('fname');
        const lname = this.publisherForm.get('lname');
        const email = this.publisherForm.get('email');
        const role = this.publisherForm.get('role');
  
        this.auth.user.subscribe(user => {
          this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
           const congID = res.congregation
           console.log(congID)
           this.route.params.subscribe(params => { 
            console.log(params)
            if (this.publisherForm.valid) {
              this.publisherService.publisherDocument(congID, params['id']).valueChanges().subscribe(pub => {
                return this.publisherService.publisherDocument(congID, params['id']).update(
                  {
                    fname: fname.value || pub.fname,
                    lname: lname.value || pub.lname,
                    email: email.value || pub.email,
                    role: role.value || pub.role
                  }).then(() => {
                    this.publisherForm.disable();
                    this.edit = false
                  })
                  .then(() => {
                    if (role.value == 'admin') {
                      return this.adminInvite(email.value || pub.email)
                    }
                  })
              });
            
              }
            });
          });    
        });
      }


  openDeleteModal() {
    this.auth.user.subscribe(user => {
      this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
       const congID = res.congregation
       this.route.params.subscribe(params => { 
        this.publisher = this.publisherService.publisherDocument(congID, params['id']).valueChanges();
        return this.publisherService.openDialog.open(DeletepublisherComponent, {
          data: this.publisher
        });
        });
      });
    });
  }

  ngOnInit() {
    this.publisherForm = this.publisherService.publisherForm;
    this.publisherForm.disable();
    this.user = this.auth.afAuth.authState;
    

    this.auth.user.subscribe(user => {
      this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
       const congID = res.congregation
       this.route.params.subscribe(params => { 
      this.publisher = this.publisherService.publisherDocument(congID, params['id']).valueChanges();
        });
      });
    });
  }

  adminInvite(email: string) {
    this.auth.user.subscribe(user => {
      this.dashService.getUserDoc(user.uid).valueChanges().subscribe(res => {
    this.route.params.subscribe(params => { 
    const actionCodeSettings = {
      // Your redirect URL
      url: 'http://localhost:4200/signup/'+ user.congregation + '/' +  params['id'],
      handleCodeInApp: true
    };

     this.auth.afAuth.auth.sendSignInLinkToEmail(
        email,
        actionCodeSettings
      ); 
                 })
            })
        })
  }

}