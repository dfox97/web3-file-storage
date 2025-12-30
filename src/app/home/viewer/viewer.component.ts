import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentInfo, EthDocUploaderService } from 'src/app/services/web3/eth-doc-uploader.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,
    MatInputModule, FormsModule, MatButtonModule, MatInputModule,
    ReactiveFormsModule],
})
export class ViewerComponent {
  public readonly data = signal<DocumentInfo | null>(null);
  public readonly index = signal<number>(0);
  public errorMessage = '';

  private readonly eth3Service = inject(EthDocUploaderService);
  public readonly address = signal<string>(this.eth3Service.account || '');

  setIndex(ev: KeyboardEvent) {
    ev.stopPropagation();
    this.errorMessage = '';

    this.index.set(Number(ev.key));
  }

  setAddress(ev: Event) {
    ev.stopPropagation();
    this.errorMessage = '';

    const input = ev.target as HTMLInputElement;
    this.address.set(input.value);
  }

  async getFileInfo(): Promise<void> {
    try {
      const data = await this.eth3Service.getUserDocument(this.address(), this.index());
      this.data.set(data);
    } catch (error) {
      this.errorMessage = 'Error fetching file info. Please try again.';
    }


  }
}
