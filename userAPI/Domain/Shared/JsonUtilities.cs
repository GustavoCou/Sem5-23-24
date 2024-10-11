using System;
using System.Text;

namespace userAPI.Domain.Shared
{
    public static class JsonUtilities
    {
        public static string SerializeUserWithNewLines(object user)
        {
            var userProperties = user.GetType().GetProperties();
            var stringBuilder = new StringBuilder();
            stringBuilder.AppendLine("{");

            foreach (var prop in userProperties)
            {
                stringBuilder.AppendLine($"    \"{prop.Name}\": \"{prop.GetValue(user)}\",");
            }

            stringBuilder.Remove(stringBuilder.Length - 3, 1); // Removes the last comma
            stringBuilder.AppendLine("}");

            return stringBuilder.ToString();
        }
    }
}