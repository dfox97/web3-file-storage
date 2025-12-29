import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EthDocUploaderService } from '../../services/web3/eth-doc-uploader.service';

type FormData = {
  fileName: string;
  ipfsHash: string;
  url: string;
};

type FormDataControls = { [key in keyof FormData]: FormControl };

@Component({
  selector: 'app-doc-upload-form',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule,
    ReactiveFormsModule],
  templateUrl: './doc-upload-form.component.html',
  styleUrls: ['./doc-upload-form.component.scss']
})
export class DocUploadFormComponent {
  readonly #formBuilder = inject(FormBuilder);
  readonly #ethDocUploaderService = inject(EthDocUploaderService);


  /* private blockchainContext: any;  */ // strategy pattern to use different blockchains.

  protected readonly suggestForm = this.#formBuilder.nonNullable.group({
    fileName: ['', [Validators.required]],
    ipfsHash: ['', [Validators.required]],
    url: ['', [Validators.required]],
  });


  protected get controls(): FormDataControls {
    return this.suggestForm.controls;
  }

  public publishToBlockchain() {
    const formData = this.values;

    if (!formData) {
      console.error('Form data is empty');
      return;
    }

    if (this.suggestForm.valid) {
      this.#ethDocUploaderService.add(formData.fileName, formData.ipfsHash, formData.url);

      this.suggestForm.reset();
    } else {
      // Mark all fields as touched to trigger validation messages
      this.suggestForm.markAllAsTouched();
    }
  }

  private get values(): FormData {
    return this.suggestForm.getRawValue();
  }

}
