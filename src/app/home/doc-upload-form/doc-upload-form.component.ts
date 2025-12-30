import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EthDocUploaderService } from '../../services/web3/eth-doc-uploader.service';

export interface FormData {
  cid: string;
  name: string;
}

@Component({
  selector: 'app-doc-upload-form',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './doc-upload-form.component.html',
  styleUrls: ['./doc-upload-form.component.scss']
})
export class DocUploadFormComponent {
  #formBuilder = inject(FormBuilder);
  #eth = inject(EthDocUploaderService);

  form = this.#formBuilder.nonNullable.group({
    cid: ['', Validators.required],
    name: ['', Validators.required]
  });

  async publishToBlockchain() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { cid, name } = this.form.getRawValue();

    try {
      await this.#eth.addDocument(cid, name);
      this.form.reset();
      console.log('Document stored on chain');
    } catch (e) {
      console.error('Failed to store document', e);
    }
  }
}
