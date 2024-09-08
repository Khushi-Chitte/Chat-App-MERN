// import { CloseIcon } from '@chakra-ui/icons'
// import { Box } from '@chakra-ui/react'
// import React from 'react'

// const UserBadgeItem = ({user,handleFunction}) => {
//   return (
//     <Box 
//     px={2} py={1} borderRadius='lg' m={1} mb={2} variant='solid' fontSize={12} color='white' backgroundColor='purple' cursor='pointer' onClick={handleFunction}
//     > 
//     {user.name}
//     <CloseIcon pl={1} />

//     </Box>
//   )
// }

// export default UserBadgeItem
// import { CloseIcon } from '@chakra-ui/icons';
// import { Box, Avatar, Text, Flex } from '@chakra-ui/react';
// import React from 'react';

// const UserBadgeItem = ({ user, handleFunction }) => {
//   return (
//     <Flex
//       alignItems="center"
//       px={2}
//       py={1}
//       borderRadius='lg'
//       m={1}
//       mb={2}
//       bg='purple.500'
//       color='white'
//       cursor='pointer'
//       onClick={handleFunction}
//       _hover={{ bg: 'purple.400' }}
//       borderWidth="1px"
//       borderColor="purple.600"
//     >
//       <Avatar name={user.name} src={user.pic} size="sm" mr={2} />
//       <Box flex="1">
//         <Text fontSize="sm" fontWeight="bold">{user.name}</Text>
//         <Text fontSize="xs">{user.email}</Text>
//       </Box>
//       <CloseIcon ml={2} />
//     </Flex>
//   );
// };

// export default UserBadgeItem;
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;