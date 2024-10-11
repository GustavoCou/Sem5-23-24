using System;
using userAPI.Domain.Shared;
using Newtonsoft.Json;

namespace userAPI.Domain.Roles
{
    public class RoleId : EntityId
    {
        [JsonConstructor]
        public RoleId(Guid value) : base(value)
        {
        }

        public RoleId(String value) : base(value)
        {
        }

        override
        protected  Object createFromString(String text){
            return new Guid(text);
        }

        override
        public String AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }
        
       
        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }
    }
}