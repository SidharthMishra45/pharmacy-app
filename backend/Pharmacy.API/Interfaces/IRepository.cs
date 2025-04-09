using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pharmacy.API.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAll();
        Task<T> GetById(Guid id);
        Task Add(T entity);
        Task Update(T entity);
        Task Delete(Guid id);
    }
}
