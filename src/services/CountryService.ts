import { Service } from "typedi";
import CountryRepository from "../database/repository/CountryRepository";
import { Pagination } from "../types/general";

@Service()
class CountryService {
  constructor(private readonly CountryRepository: CountryRepository) {}

  async findAll(pagination: Pagination) {
    return this.CountryRepository.findAll(pagination);
  }

  async exists(id: string) {
    return this.CountryRepository.exists(id);
  }
}

export default CountryService;
