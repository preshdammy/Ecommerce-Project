'use client';

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteuser(id: $id)
  }
`;

export default function DeleteAccountForm() {
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [deleteUser] = useMutation(DELETE_USER);

  async function handleDelete() {
    if (!confirmChecked) return;

    const userCookie = Cookies.get('user');
    if (!userCookie) {
      alert('User not found or not logged in.');
      return;
    }

    const user = JSON.parse(userCookie);
    const id = user.id;

    try {
      const { data } = await deleteUser({ variables: { id } });
      if (data?.deleteuser) {
        alert('Your account has been deleted. We’re sorry to see you go.');
        Cookies.remove('user');
        // Optionally redirect
        window.location.href = '/landingpage';
      } else {
        alert('Failed to delete account.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting your account.');
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto">
      <p className="mb-4 text-red-700 font-semibold text-lg">
        Warning: This action is irreversible!
      </p>
      <p className="mb-6 text-gray-700">
        Deleting your account will permanently remove all your data, and you will not be able to recover it.
        Please be sure before you proceed.
      </p>

      <label className="flex items-center mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmChecked}
          onChange={(e) => setConfirmChecked(e.target.checked)}
          className="mr-3 h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
        />
        <span className="text-gray-800 select-none">
          Yes, I understand the consequences and want to delete my account.
        </span>
      </label>

      <button
        onClick={handleDelete}
        disabled={!confirmChecked}
        className={`w-full py-3 rounded-md font-semibold transition
          ${confirmChecked
            ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
            : 'bg-red-300 text-gray-400 cursor-not-allowed'
          }`}
      >
        Delete Account
      </button>
    </div>
  );
}
