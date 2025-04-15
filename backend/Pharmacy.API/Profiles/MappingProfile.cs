using AutoMapper;
using Pharmacy.API.Models;
using Pharmacy.API.DTOs;

namespace Pharmacy.API.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Inventory mappings
            CreateMap<Inventory, InventoryReadDto>()
                .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId));
            CreateMap<InventoryCreateDto, Inventory>();
            CreateMap<InventoryUpdateDto, Inventory>();

            // Order mappings
            CreateMap<Order, OrderResponseDto>();
            CreateMap<OrderItem, OrderItemResponseDto>()
                .ForMember(dest => dest.DrugName, opt => opt.MapFrom(src => src.Drug.Name))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Drug.Price));

            CreateMap<PlaceOrderDto, Order>();
            CreateMap<OrderItemDto, OrderItem>();
        }
    }
}
