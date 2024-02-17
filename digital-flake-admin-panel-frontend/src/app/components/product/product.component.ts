import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { DbConnectionService } from '../../services/db-connection.service';
import { PaginationService } from '../../services/pagination.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  constructor(private formBuilder: FormBuilder, private service: ProductService, private pagination: PaginationService, private route: ActivatedRoute,private dBConnection:DbConnectionService, private toastr:ToastrService) {
    this.paginationForm = this.formBuilder.group({
      Limit: ['']
    });
    this.addForm = this.formBuilder.group({
      
      category_id: ["", [Validators.required]],
      name: ["", [Validators.required]],
      pack_size: ["", [Validators.required,Validators.min(0)]],
      mrp: ["", [Validators.required]],
      image: ["", [Validators.required]],
      isActive: ["", [Validators.required]],
    });

    this.updateForm = this.formBuilder.group({
      id: ["", [Validators.required]],
      category_id: ["", [Validators.required]],
      name: ["", [Validators.required]],
      pack_size: ["", [Validators.required,Validators.min(0)]],
      mrp: ["", [Validators.required]],
      image: [""],
      isActive: ["", [Validators.required]],
    });
  }

  host_url:string = this.dBConnection.connectionURL;
  component_name: string = "Product";
  listing_block: string = "";
  add_block: string = "";
  update_block: string = "";
  


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



  //addForm form
  addForm!: FormGroup;
  updateForm !: FormGroup;
  viewForm !: FormGroup;

  all_category: any = [];
  all_subcategory: any = [];
  all_vendor: any = [];


  image: any;
  render_image: any;

  col1 = -1;
  col2 = -1;
  col3 = -1;
  col4 = -1;
  col5 = -1;
  col6 = -1;
  col7 = -1;



 
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

    if (sort_type == 1 && sort_field == "price_size") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col3 = -1;

    }
    else if (sort_type == -1 && sort_field == "price_size") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col3 = 1;
    }

    if (sort_type == 1 && sort_field == "category_details.name") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col4 = -1;

    }
    else if (sort_type == -1 && sort_field == "category_details.name") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col4 = 1;
    }

    if (sort_type == 1 && sort_field == "mrp") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col5 = -1;

    }
    else if (sort_type == -1 && sort_field == "mrp") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col5 = 1;
    }

    if (sort_type == 1 && sort_field == "image") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col6 = -1;

    }
    else if (sort_type == -1 && sort_field == "image") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col6 = 1;
    }

    if (sort_type == 1 && sort_field == "isActive") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col7 = -1;

    }
    else if (sort_type == -1 && sort_field == "isActive") {
      this.sort_field = sort_field;
      this.sort_type = sort_type;
      this.name = name;
      this.page = page;
      this.getData();
      this.col7 = 1;
    }
  }
 

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
    this.resetSorting();
  
    
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

  getData() {
    this.resetVariables();
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
    this.service.add(form, this.image).subscribe((data) => {
      if (this.service.checkForSession(data)) {
        if (data.status == true) {
          this.ngOnInit();
          this.toastr.success(data.message);
          this.formReset(form);
          this.resetVariables();
        }
        if (data.status == false) {
          this.toastr.error(data.message);
        }
      }
    });
  }

  getUpdateData(id: string, form: FormGroup) {
    this.resetVariables();
    this.formReset(form);
    this.getAllCategory();

    this.service.findById(id).subscribe((data) => {
      if (this.service.checkForSession(data)) {
        if (data.status == true) {
          form.controls['id'].setValue(data.data.id);
          form.controls['category_id'].setValue(data.data.category_id);
          form.controls['name'].setValue(data.data.name);
          form.controls['pack_size'].setValue(data.data.pack_size);
          form.controls['mrp'].setValue(data.data.mrp);
          form.controls['isActive'].setValue(data.data.isActive);
          this.updateBtn();
        }
        if (data.status == false) {

        }
      }
    });
  }

  updateFormService(form: FormGroup) {
    this.service.update(form,this.image).subscribe((data) => {
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

  getAllCategory() {
    this.all_category = [];
    this.service.getCategory().subscribe((data) => {
      if (this.service.checkForSession(data)) {
        if (data.status == true) {
          this.all_category = data.data;
        }
      }
    });
  }

  imageCheck(form: FormGroup, event: any) {
      this.image = "";
      this.render_image = "";
      let checked_file = this.validateImage(form, 'image1', event);
      this.image = checked_file.image;
      if (checked_file.status == true) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.render_image = event.target.result;
        }
      }
  }

  validateImage(form: FormGroup, formControlName: string, event: any): any {
    if (event.target.files.length > 0) {
      let type = "";
      let split_count;
      split_count = ((event.target.files[0].name).split('.')).length;
      type = ((event.target.files[0].name).split('.'))[split_count - 1];
      if (type.toLowerCase() == "jpg") {
        let return_image = event.target.files[0];
        return { image: return_image, status: true };
      }
      else {
        alert("Please select file of format JPG");
        form.controls[formControlName].setValue("");
        return { image: "", render: false };
      }
    }
    else {
      return { image: "", render: false };
    }
  }

  resetVariables()
  {
    this.image = "";
    this.render_image = "";
    
  }

  resetSorting()
  {
    this.sort_field = "created_at";
    this.sort_type = -1;
    this.col1 = -1;
    this.col2 = -1;
    this.col3 = -1;
    this.col4 = -1;
    this.col5 = -1;
    this.col6 = -1;
    this.col7 = -1;
  }

  search(event: any) {
    this.name = event.value;
    this.pagination.search(this.name);
  }

  addBtn() {
    this.listing_block = "d-none";
    this.add_block = "d-block";
    this.update_block = "d-none";
    this.resetVariables();
    this.addForm.reset();
    this.addForm.controls['category_id'].setValue("");    
    this.addForm.controls['isActive'].setValue(1);    
    this.getAllCategory();
  }

  updateBtn() {
    this.listing_block = "d-none";
    this.add_block = "d-none";
    this.update_block = "d-block";
    this.image = "";
    this.render_image = "";
  }

  viewBtn() {
    this.listing_block = "d-none";
    this.add_block = "d-none";
    this.update_block = "d-none";
  }

  BackBtn() {
    this.listing_block = 'd-block';
    this.add_block = "d-none";
    this.update_block = "d-none";
    this.image = "";
    this.render_image = "";
    
    this.ngOnInit();
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
