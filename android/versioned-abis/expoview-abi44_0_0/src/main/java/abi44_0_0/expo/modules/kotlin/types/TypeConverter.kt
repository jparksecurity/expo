package abi44_0_0.expo.modules.kotlin.types

import abi44_0_0.com.facebook.react.bridge.Dynamic

abstract class TypeConverter<Type : Any>(
  private val isOptional: Boolean
) {
  open fun convert(value: Dynamic): Type? {
    if (value.isNull) {
      if (isOptional) {
        return null
      }
      throw IllegalArgumentException()
    }
    return convertNonOptional(value)
  }

  abstract fun convertNonOptional(value: Dynamic): Type
}
