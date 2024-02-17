import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { PaginationService } from '../../services/pagination.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  constructor(private formBuilder: FormBuilder, private service: CategoryService, private pagination: PaginationService, private route: ActivatedRoute, private toastr: ToastrService) {
    this.paginationForm = this.formBuilder.group({
      Limit: ['']
    });
    this.addForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      isActive: ["", [Validators.required]],

    });
    this.updateForm = this.formBuilder.group({
      id: ["", [Validators.required]],
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      isActive: ["", [Validators.required]],
    });

  }


  component_name: string = " Category";
  listing_block: string = "";
  add_block: string = "";
  update_block: string = "";
  view_block: string = "";


  //Search Form
  //  searchForm: FormGroup;
  Data: any = [];
  page = 1;
  sort_field = "created_at";
  sort_type = -1;
  name = "";

  //pagination
  paginationForm: FormGroup
  next: boolean = false;  // next page
  back: boolean = false; // back page
  limit: number = 10;
  refresh: boolean = true; // pages get refresh or when opens first
  sr: number = 1; //serail number
  totalPages: number = 1; // for total pages
  totalresult: number = 0; // total result

  //alerts
  successAlert = "d-none";
  successAlertMessage = "";
  errorAlert = "d-none";
  errorAlertMessage = ""


  //addForm form
  addForm!: FormGroup;
  updateForm !: FormGroup;


  col1 = -1;
  col2 = -1;
  col3 = -1;
  col4 = -1;

  

  fetchDataQuery() {
    this.route.queryParams.subscribe(params => {
      this.page = Number(JSON.parse(JSON.stringify(params)).pages) || 1;
      this.limit = Number(JSON.parse(JSON.stringify(params)).limit) || 10;
      this.paginationForm.controls['Limit'].setValue(this.limit);

      if (JSON.parse(JSON.stringify(params)).search == undefined) {
        this.name = "";
      }
      else {
        this.name = JSON.parse(JSON.stringify(params)).search;
      }

      if (this.refresh == false) {
        this.ngOnInit();
      }
    }
    );
  }

  ngOnInit() {
    this.listing_block = 'd-block';
    this.add_block = "d-none";
    this.update_block = "d-none";
    this.view_block = "d-none";
    this.resetVariable();
    if (this.refresh == true) {
      this.fetchDataQuery();
      this.refresh = false;
    }
    else {
      // this.page = pages;
    }
    this.sr = this.pagination.serialNumber(this.limit, this.page);

    this.getData();
  }

  sort(page: number, sort_field: string, sort_type: number, name: string) {

    if (sort_type == 1 && sort_field == "id") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col1 = -1;

    }
    else if (sort_type == -1 && sort_field == "id") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col1 = 1;
    }

    if (sort_type == 1 && sort_field == "name") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col2 = -1;

    }
    else if (sort_type == -1 && sort_field == "name") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col2 = 1;
    }

    if (sort_type == 1 && sort_field == "description") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col3 = -1;

    }
    else if (sort_type == -1 && sort_field == "description") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col3 = 1;
    }

    if (sort_type == 1 && sort_field == "isActive") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col4 = -1;

    }
    else if (sort_type == -1 && sort_field == "isActive") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col4 = 1;
    }
  }

  getData() {
    this.Data = [];
    this.service.list(this.sort_field, this.sort_type, this.name, this.page, this.limit).subscribe((data) => {
      if (this.service.checkForSession(data)) {
        if (data.data[0].data.length != 0) {
          this.Data = data.data[0].data;
          this.totalPages = Math.ceil(data.data[0].metadata[0].total / this.limit)
          this.totalresult = data.data[0].metadata[0].total;

          if (this.page == this.totalPages) {
            this.next = false;
          }
          else {
            this.next = true;
          }

          if (this.page <= 1) {
            this.back = false;
          }
          else {
            this.back = true;
          }
        }
      }
    });
  }

  addFormService(form: FormGroup) {
    this.service.add(form).subscribe((data) => {
      if (this.service.checkForSession(data)) {
        if (data.status == true) {
          this.ngOnInit();
          this.toastr.success(data.message);
          this.formReset(form);
        }
        if (data.status == false) {
          this.toastr.error(data.message);
        }
      }
    });
  }

  getUpdateData(id: string, form: FormGroup) {
    this.service.findById(id).subscribe((data) => {
      if (this.service.checkForSession(data)) {
        if (data.status == true) {
          form.reset();
          form.controls['id'].setValue(data.data.id);
          form.controls['name'].setValue(data.data.name);
          form.controls['description'].setValue(data.data.description);
          form.controls['isActive'].setValue(data.data.isActive);
          this.updateBtn();
        }
        if (data.status == false) {

        }
      }
    });
  }

  updateFormService(form: FormGroup) {
    this.service.update(form).subscribe((data) => {
      if (this.service.checkForSession(data)) {
        if (data.status == true) {
          this.ngOnInit();
          this.toastr.success(data.message);
          this.formReset(form);
        }
        if (data.status == false) {
          this.toastr.error(data.message);
        }
      }
    });
  }

  deleteService(id: string) {
    Swal.fire({
      title: 'Are you sure you want to delete ?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe((data) => {
          if (this.service.checkForSession(data)) {
            if (data.status == true) {
              this.ngOnInit();
              this.toastr.success(data.message);
            }
            if (data.status == false) {
              this.toastr.error(data.message);
            }
          }
        });
      }
    })
  }

  resetVariable() {
    this.sort_field = "created_at";
    this.sort_type = -1;
    this.col1 = -1;
    this.col2 = -1;
    this.col3 = -1;
    this.col4 = -1;
  }


  addBtn() {
    this.listing_block = "d-none";
    this.add_block = "d-block";
    this.update_block = "d-none";
    this.view_block = "d-none";
  }

  updateBtn() {
    this.listing_block = "d-none";
    this.add_block = "d-none";
    this.update_block = "d-block";
    this.view_block = "d-none";
  }

  viewBtn() {
    this.listing_block = "d-none";
    this.add_block = "d-none";
    this.update_block = "d-none";
    this.view_block = "d-block";
  }

  BackBtn() {
    this.listing_block = 'd-block';
    this.add_block = "d-none";
    this.update_block = "d-none";
    this.view_block = "d-none";
  }

  search(event: any) {
    this.name = event.value;
    this.pagination.search(this.name);
  }
  firstPage() {
    this.page = this.pagination.first();
  }
  lastPage() {
    this.page = this.pagination.last(this.totalPages);
  }
  backPage() {
    this.page = this.pagination.back(this.page);
  }
  nextPage() {
    this.page = this.pagination.next(this.page);
  }
  onChange(val: any) {
    this.limit = this.pagination.limit(val);
  }
  touched(form: FormGroup) {
    for (let i in form.controls)
      form.controls[i].markAsTouched()
  }
  formReset(form: FormGroup) {
    form.reset();
  }


}
