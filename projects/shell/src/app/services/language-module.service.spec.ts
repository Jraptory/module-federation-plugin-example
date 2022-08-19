import { TestBed } from '@angular/core/testing';

import { LanguageModuleService } from './language-module.service';

describe('LanguageModuleService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: LanguageModuleService = TestBed.get(
			LanguageModuleService
		);
		expect(service).toBeTruthy();
	});
});
