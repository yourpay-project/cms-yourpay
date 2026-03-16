import {
  deleteV1OperatorsCountriesById,
  postV1OperatorsCountries,
  putV1OperatorsCountries,
} from "@/shared/api/generated";

import type {
  ExampleCountryResponse,
  NewCountryRequest,
  UpdateCountryRequest,
} from "@/shared/api/generated";

export type { NewCountryRequest, UpdateCountryRequest, ExampleCountryResponse };

export const countryApi = {
  create: postV1OperatorsCountries,
  update: putV1OperatorsCountries,
  remove: deleteV1OperatorsCountriesById,
};

