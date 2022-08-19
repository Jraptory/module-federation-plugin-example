import { TestBed } from '@angular/core/testing';

import { MultiLanguageModuleService } from './multi-language-module.service';

describe('MultiLanguageModuleService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: MultiLanguageModuleService = TestBed.get(
			MultiLanguageModuleService
		);
		expect(service).toBeTruthy();
	});
});
